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
  const handleChangeFileArray = (newValue: File[]) => {
    // find video files
    const videoFileArray = newValue.filter((file) => {
      return file.type === "video/mp4" || file.type === "video/x-flv";
    });
    // find danmaku files
    const danmakuFileArray = newValue.filter((file) => {
      return file.type === "text/xml";
    });
    // update video and danmaku arraies in appData
    props.setAppData((appData: AppData) => ({
      ...appData,
      videoFileArray: videoFileArray,
      danmakuFileArray: danmakuFileArray,
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
      selectedVideo: props.file,
    }));
  };

  return (
    <ListItem>
      <ListItemButton onClick={handleClick}>
        <ListItemText
          primary={props.file.name + " (" + props.file.size + " B)"}
        />
      </ListItemButton>
    </ListItem>
  );
}

function FilePanel(props: any) {
  return (
    <List>
      {props.fileArray.map((file: File, i: number) => (
        <FilePanelItem file={file} key={i} setAppData={props.setAppData} />
      ))}
    </List>
  );
}

function VideoPlayer(props: any) {
  if (document.getElementById("dplayer")) {
    const dp = new DPlayer({
      container: document.getElementById("dplayer"),
      screenshot: true,
      video: {
        // url: "92613_20230329_095623_010529.mp4",
        url: props.video ? URL.createObjectURL(props.video) : "",
      },
      // danmaku: {
      //   id: "demo",
      //   api: "https://api.prprpr.me/dplayer/",
      // },
    });
  }
  return <div id="dplayer"></div>;
}

interface AppData {
  videoFileArray: File[];
  danmakuFileArray: File[];
  selectedVideo: File | null;
  selectedDanmaku: File | null;
}

export default function App() {
  const [appData, setAppData] = React.useState<AppData>({
    videoFileArray: [],
    danmakuFileArray: [],
    selectedVideo: null,
    selectedDanmaku: null,
  });

  return (
    <Container maxWidth="sm">
      <Box>
        Select Videos (flv, mp4) and Danmaku Files (xml):
        <FileInput setAppData={setAppData} />
      </Box>
      <Box>
        <FilePanel fileArray={appData.videoFileArray} setAppData={setAppData} />
        <FilePanel
          fileArray={appData.danmakuFileArray}
          setAppData={setAppData}
        />
      </Box>
      <Box>
        <VideoPlayer
          video={appData.selectedVideo}
          danmaku={appData.selectedDanmaku}
        />
      </Box>
      <Copyright />
    </Container>
  );
}
