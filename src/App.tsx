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
    props.setAppData({
      ...props.appData,
      videoFileArray: videoFileArray,
      danmakuFileArray: danmakuFileArray,
      test: "changed",
    });
  };
  return (
    <MuiFileInput multiple onChange={handleChangeFileArray} hideSizeText />
  );
}

function FilePanelItem(props: any) {
  return (
    <ListItem>
      <ListItemButton>
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
        <FilePanelItem file={file} key={i} />
      ))}
    </List>
  );
}

interface AppData {
  videoFileArray: File[];
  danmakuFileArray: File[];
  test: string;
}

export default function App() {
  const [appData, setAppData] = React.useState<AppData>({
    videoFileArray: [],
    danmakuFileArray: [],
    test: "test",
  });

  // const dp = new DPlayer({
  //   container: document.getElementById("dplayer"),
  //   // screenshot: true,
  //   video: {
  //     url: "demo.mp4",
  //     // pic: "demo.jpg",
  //     // thumbnails: "thumbnails.jpg",
  //   },
  //   // danmaku: {
  //   //   id: "demo",
  //   //   api: "https://api.prprpr.me/dplayer/",
  //   // },
  // });

  return (
    <Container maxWidth="sm">
      <Box>
        Select Videos (flv, mp4) and Danmaku Files (xml):
        <FileInput appData={appData} setAppData={setAppData} />
        {/* <input
          type="file"
          multiple
          onChange={(e) => {
            // if e.currentTarget.files !== null {
            //   handleChangeFileArray([...e.currentTarget.files]);            }
            if (e.currentTarget.files) {
              for (let i = 0; i < e.currentTarget.files?.length; i++) {
                console.log(e.currentTarget.files?.item(i));
              }
            }
          }}
        /> */}
      </Box>
      <Box>
        <FilePanel fileArray={appData.videoFileArray} />
        <FilePanel fileArray={appData.danmakuFileArray} />
      </Box>
      <Copyright />
    </Container>
  );
}
