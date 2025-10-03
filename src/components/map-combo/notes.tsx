import { Trans, useTranslation } from "react-i18next";

export function Notes() {
  "use no memo"; // make sure Trans update
  const { t } = useTranslation("map-combo");
  return (
    <div>
      <h3>{t(($) => $.notes.title)}</h3>
      <p>{t(($) => $.notes.description)}</p>
      <ol className="leading-7">
        <li>{t(($) => $.notes.p1)}</li>
        <li>{t(($) => $.notes.p2)}</li>
        <li>
          {/* t("notes.p3", { ns: "map-combo" }) */}
          <Trans
            ns="map-combo"
            i18nKey={($) => $.notes.p3}
            values={{
              config:
                "%USERPROFILE%\\Documents\\Euro Truck Simulator 2\\config.cfg",
              param: "r_buffer_page_size",
            }}
          >
            <code />
            <code />
          </Trans>
        </li>
      </ol>
    </div>
  );
}
