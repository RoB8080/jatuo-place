import { useEffect, useState, type ReactNode } from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

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
