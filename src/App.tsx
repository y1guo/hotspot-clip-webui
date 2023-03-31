import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import DPlayer from "dplayer";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/y1guo/hotspot-clip-webui">
        hotspot-clip-webui
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

function FileInput(props: any) {
  const handleChangeFileArray = (fileList: File[]) => {
    // group video and danmaku files into recordings by filename
    const recordingMap = new Map<string, Recording>();
    fileList.forEach((file) => {
      // name without extension, file might have multiple '.' in name
      const name = file.name.split(".").slice(0, -1).join(".");
      const type = file.type;
      const recording = recordingMap.get(name);
      if (recording) {
        if (type === "video/mp4" || type === "video/x-flv") {
          recording.video = file;
        } else if (type === "text/xml") {
          recording.danmaku = file;
        }
      } else {
        if (type === "video/mp4" || type === "video/x-flv") {
          recordingMap.set(name, { name: name, video: file, danmaku: null });
        } else if (type === "text/xml") {
          recordingMap.set(name, { name: name, video: null, danmaku: file });
        }
      }
    });
    // convert recording map to array
    const recordingArray: Recording[] = [];
    recordingMap.forEach((recording) => {
      recordingArray.push(recording);
    });
    // update recording arraies in appData
    props.setAppData((appData: AppData) => ({
      ...appData,
      recordingArray: recordingArray,
    }));
  };

  return (
    <MuiFileInput multiple onChange={handleChangeFileArray} hideSizeText />
  );
}

function FilePanelItem(props: any) {
  // set selected video on click
  const handleClick = () => {
    props.setAppData((appData: AppData) => ({
      ...appData,
      selectedRecording: props.recording,
    }));
  };

  return (
    <ListItem>
      <ListItemButton onClick={handleClick}>
        <ListItemText
          primary={
            props.recording.name +
            " (" +
            (props.recording.video
              ? props.recording.video.size + " B"
              : "No Video") +
            " + " +
            (props.recording.danmaku
              ? props.recording.danmaku.size + " B"
              : "No Danmaku") +
            ")"
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

function FilePanel(props: any) {
  return (
    <List>
      {props.recordingArray.map((recording: Recording, i: number) => (
        <FilePanelItem
          key={i}
          recording={recording}
          setAppData={props.setAppData}
        />
      ))}
    </List>
  );
}

function VideoPlayer(props: any) {
  const [dplayer, setDplayer] = React.useState<DPlayer | null>(null);
  const danmaku = {
    id: "9E2E3368B56CDBB4",
    token: "tokendemo",
    api: "https://api.prprpr.me/dplayer/",
    addition: ["https://api.prprpr.me/dplayer/v3/bilibili?aid=4157142"],
    user: "DIYgod",
    bottom: "15%",
  };
  React.useEffect(() => {
    const dp = new DPlayer({
      container: document.getElementById("dplayer"),
      screenshot: true,
      video: {
        url: "",
      },
      danmaku: danmaku,
    });
    setDplayer(dp);
  }, []);

  React.useEffect(() => {
    if (props.recording) {
      dplayer?.switchVideo(
        {
          url: URL.createObjectURL(props.recording.video),
        },
        danmaku
      );
    }
  }, [props.recording]);

  React.useEffect(() => {
    if (dplayer) {
      console.log(props.test);
      dplayer.notice("test notice", 1000, 1.0);
      dplayer.danmaku.draw({
        text: "vsfdjn s vu s vsfdun sdfvnsdfuhvn sdfiubs ",
        color: "#f00",
        type: "right",
      });
      dplayer.danmaku.show();
    }
  }, [props.test]);

  return <div id="dplayer"></div>;
}

interface Recording {
  name: string;
  video: File | null;
  danmaku: File | null;
}

interface AppData {
  recordingArray: Recording[];
  selectedRecording: Recording | null;
  dplayer: DPlayer | null;
}

export default function App() {
  const [appData, setAppData] = React.useState<AppData>({
    recordingArray: [],
    selectedRecording: null,
    dplayer: null,
  });

  const [test, setTest] = React.useState(0);

  return (
    <Container maxWidth="lg">
      <Box>
        Select Videos (flv, mp4) and Danmaku Files (xml):
        <FileInput setAppData={setAppData} />
      </Box>
      <Box>
        <FilePanel
          recordingArray={appData.recordingArray}
          setAppData={setAppData}
        />
      </Box>
      <Box>
        <VideoPlayer
          recording={appData.selectedRecording}
          setAppData={setAppData}
          test={test}
        />
      </Box>
      <Button
        variant="contained"
        onClick={() => {
          setTest(test + 1);
        }}
      >
        test
      </Button>
      <Copyright />
    </Container>
  );
}
