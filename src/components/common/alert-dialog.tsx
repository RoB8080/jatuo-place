import {
  useEffect,
  useState,
  type ReactNode,
  type ComponentProps,
} from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "../ui/kbd";
import { useHotkeys } from "react-hotkeys-hook";

type AlertDialogTemplate<T = unknown, P = unknown> = (
  props: P & {
    id: string;
    confirm: (value: T) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cancel: (reason?: any) => void;
    close: (id: string) => void;
  },
) => ReactNode;

type AlertDialogOptions<T = unknown, P = unknown> = {
  title?: ReactNode;
  description?: ReactNode;
  component: AlertDialogTemplate<T, P>;
  componentProps?: P;
};

type AlertDialogItem<T = unknown, P = unknown> = {
  id: string;
  open: boolean;
  options: AlertDialogOptions<T, P>;
  resolve: (value: T) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
};

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 事件驱动渲染更新
const emitter = new EventTarget();
const UPDATE_EVENT = "alert-dialog:update";
function notify() {
  emitter.dispatchEvent(new Event(UPDATE_EVENT));
}

const store = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dialogs: [] as AlertDialogItem<any, any>[],
};

function close(id: string) {
  const idx = store.dialogs.findIndex((d) => d.id === id);
  if (idx !== -1) {
    store.dialogs.splice(idx, 1);
    notify();
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function defineAlertDialogTemplate<T = unknown, P = unknown>(
  component: AlertDialogTemplate<T, P>,
): AlertDialogTemplate<T, P> {
  return component;
}

// eslint-disable-next-line react-refresh/only-export-components
export function invokeAlertDialog<T = unknown, P = unknown>(
  options: AlertDialogOptions<T, P>,
): Promise<T> {
  const { promise, resolve, reject } = Promise.withResolvers<T>();
  const id = generateId();
  store.dialogs.push({ id, open: true, options, resolve, reject });
  notify();
  return promise;
}

type ConfirmDialogComponentProps = {
  title?: ReactNode;
  content?: ReactNode;
  cancelText?: ReactNode;
  confirmText?: ReactNode;
  cancelProps?: Omit<ComponentProps<typeof Button>, "children" | "onClick">;
  confirmProps?: Omit<ComponentProps<typeof Button>, "children" | "onClick">;
};

// eslint-disable-next-line react-refresh/only-export-components
export function invokeConfirmDialog(
  options: ConfirmDialogComponentProps,
): Promise<boolean> {
  const Template = defineAlertDialogTemplate<
    boolean,
    ConfirmDialogComponentProps
  >(
    ({
      id,
      confirm,
      title,
      content,
      cancelText,
      confirmText,
      cancelProps,
      confirmProps,
    }) => {
      useHotkeys("y", () => {
        try {
          confirm(true);
        } catch (e) {
          console.error("Confirm button click failed", e);
        }
      });
      useHotkeys("esc", () => {
        try {
          confirm(false);
        } catch (e) {
          console.error("Cancel button click failed", e);
        }
      });

      return (
        <div key={id} className="flex flex-col gap-4">
          {(title || content) && (
            <AlertDialogHeader>
              {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
              {content && (
                <AlertDialogDescription>{content}</AlertDialogDescription>
              )}
            </AlertDialogHeader>
          )}
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                try {
                  confirm(false);
                } catch (e) {
                  console.error("Cancel button click failed", e);
                }
              }}
              {...cancelProps}
            >
              {cancelText ?? "Cancel"}
              <Kbd>Esc</Kbd>
            </Button>
            <Button
              onClick={() => {
                try {
                  confirm(true);
                } catch (e) {
                  console.error("Confirm button click failed", e);
                }
              }}
              {...confirmProps}
            >
              {confirmText ?? "Confirm"}
              <Kbd>Y</Kbd>
            </Button>
          </AlertDialogFooter>
        </div>
      );
    },
  );

  return invokeAlertDialog<boolean, ConfirmDialogComponentProps>({
    component: Template,
    componentProps: options,
  });
}

// eslint-disable-next-line react-refresh/only-export-components
export function closeAlertDialog(id: string) {
  close(id);
}

export function AlertDialogRoot() {
  // 使用订阅机制触发重新渲染
  const [, force] = useState(0);
  useEffect(() => {
    const listener: EventListener = () => {
      force((x) => x + 1);
    };
    emitter.addEventListener(UPDATE_EVENT, listener);
    return () => emitter.removeEventListener(UPDATE_EVENT, listener);
  }, []);

  return (
    <>
      {store.dialogs.map(({ id, open, options, resolve, reject }) => {
        const Comp = options.component as (
          props: Record<string, unknown>,
        ) => ReactNode;
        const renderedContent = (
          <Comp
            {...(options.componentProps as Record<string, unknown>)}
            id={id}
            close={close}
            confirm={(value: unknown) => {
              try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (resolve as (v: any) => void)(value);
              } finally {
                close(id);
              }
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cancel={(reason?: any) => {
              try {
                reject(reason ?? new Error("AlertDialog cancelled"));
              } finally {
                close(id);
              }
            }}
          />
        );

        return (
          <AlertDialog
            key={id}
            open={open}
            onOpenChange={(next) => {
              if (!next) {
                try {
                  reject(new Error("AlertDialog dismissed"));
                } finally {
                  close(id);
                }
              }
            }}
          >
            <AlertDialogContent>{renderedContent}</AlertDialogContent>
          </AlertDialog>
        );
      })}
    </>
  );
}
