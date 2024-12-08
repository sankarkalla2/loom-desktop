import { useReducer } from "react";

export type SourceDiviceStateProps = {
  displays?: {
    appIcon: null;
    display_id: string;
    id: string;
    name: string;
    thumbnail: unknown[];
  }[];
  audioInputs?: {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
  }[];
  error?: string | null;
  isPending: boolean;
};
type DispalyDeviceActionProps = {
  type: "GET_DIVICES";
  payload: SourceDiviceStateProps;
};

export const getMediaSources = async () => {
  console.log("called");
  const displays = await window.ipcRenderer.invoke("get-sources");
  const enumarateDevices =
    await window.navigator.mediaDevices.enumerateDevices();

  console.log("all devices", enumarateDevices);

  const audioInputs = enumarateDevices.filter(
    (divice) => divice.kind === "audioinput"
  );

  console.log("getting resources");

  return { displays: displays,audios: audioInputs };
};

export const useMediaSources = () => {
  const [state, action] = useReducer(
    (state: SourceDiviceStateProps, action: DispalyDeviceActionProps) => {
      switch (action.type) {
        case "GET_DIVICES":
          return { ...state, ...action.payload };

        default:
          return state;
      }
    },
    {
      displays: [],
      audioInputs: [],
      error: null,
      isPending: false,
    }
  );

  const fetchMediaSources = () => {
    console.log("called fetch media resouces");
    action({ type: "GET_DIVICES", payload: { isPending: true } });
    getMediaSources().then((res) =>
      action({
        type: "GET_DIVICES",
        payload: {
          displays: res.displays,
          audioInputs: res.audios,
          isPending: false,
        },
      })
    );
  };

  return { fetchMediaSources, state };
};
