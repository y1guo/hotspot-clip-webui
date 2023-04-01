import * as React from "react";
import "./App.css";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Slider,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import ReactPlayer from "react-player";
import Danmaku from "danmaku";
import { bilibiliParser } from "./xmlParser";
import { bytesToSize } from "./utils";

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
  const [value, setValue] = React.useState<File[]>([]);
  const handleChangeFileArray = (fileList: File[]) => {
    // group video and danmaku files into recordings by filename
    const recordingMap = new Map<string, Recording>();
    fileList.forEach((file) => {
      // name without extension
      const name = file.name.split(/\.|_/).slice(0, 4).join("_");
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
    // update value
    setValue(fileList);
  };

  return (
    <MuiFileInput
      multiple
      value={value}
      onChange={handleChangeFileArray}
      getInputText={() => {
        return "Select Video and Danmaku";
      }}
      hideSizeText
      sx={{ bgcolor: "background.paper", border: 1, borderRadius: 3 }}
      inputProps={{ accept: ".mp4,.flv,.xml" }}
    />
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
              ? bytesToSize(props.recording.video.size)
              : "No Video") +
            " + " +
            (props.recording.danmaku
              ? bytesToSize(props.recording.danmaku.size)
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
    <List sx={{ overflow: "auto", width: "100%", height: "100%" }}>
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
  // get video url from selected recording
  const [url, setUrl] = React.useState("");
  React.useEffect(() => {
    if (props.recording && props.recording.video) {
      setUrl(URL.createObjectURL(props.recording.video));
    } else {
      setUrl("");
    }
  }, [props.recording]);

  return (
    <ReactPlayer
      id={"video-container"}
      url={url}
      controls={true}
      playing={true}
      width={1600}
      height={900}
      style={{ position: "relative" }}
    />
  );
}

function DanmakuPlayer(props: any) {
  const [danmaku, setDanmaku] = React.useState<Danmaku | null>(null);
  const [comments, setComments] = React.useState<DanmakuComment[]>([]);
  const container = document.getElementById("video-container");
  const video = document.querySelector("video");
  React.useEffect(() => {
    if (props.recording && props.recording.danmaku) {
      // parse danmaku xml
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setComments(bilibiliParser(result));
        }
      };
      reader.readAsText(props.recording.danmaku);
    }
  }, [props.recording]);
  React.useEffect(() => {
    if (props.recording && props.recording.danmaku && container && video) {
      // init danmaku player
      const dm = new Danmaku({
        container: container,
        media: video,
        comments: comments,
        engine: "dom",
        speed: 144,
      });
      setDanmaku(dm);
      // set danmaku opacity
      (
        document.querySelector("#video-container div") as HTMLElement
      ).style.opacity = props.danmakuOpacity.toString();
      // destroy danmaku player on unmount
      return () => {
        dm.destroy();
      };
    }
  }, [props.recording, comments]);
  // show/hide danmaku
  React.useEffect(() => {
    if (danmaku) {
      if (props.showDanmaku) {
        danmaku.show();
      } else {
        danmaku.hide();
      }
    }
  }, [props.showDanmaku]);
  // update danmaku opacity
  React.useEffect(() => {
    const danmakuElement = document.querySelector(
      "#video-container div"
    ) as HTMLElement;
    if (danmakuElement) {
      danmakuElement.style.opacity = props.danmakuOpacity.toString();
    }
  }, [props.danmakuOpacity]);
  // update danmaku speed
  React.useEffect(() => {
    if (danmaku) {
      danmaku.speed = props.danmakuSpeed;
    }
  }, [props.danmakuSpeed]);
  return <></>;
}

interface Recording {
  name: string;
  video: File | null;
  danmaku: File | null;
}

interface AppData {
  recordingArray: Recording[];
  selectedRecording: Recording | null;
  showDanmaku: boolean;
  danmakuOpacity: number;
  danmakuSpeed: number;
}

export default function App() {
  const [appData, setAppData] = React.useState<AppData>({
    recordingArray: [],
    selectedRecording: null,
    showDanmaku: true,
    danmakuOpacity: 0.5,
    danmakuSpeed: 144,
  });

  const [test, setTest] = React.useState(0);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          p: 1,
        }}
      >
        <Box sx={{ p: 1 }}>
          <FileInput setAppData={setAppData} />
        </Box>
        <Box sx={{ width: "100%", height: "100%" }}>
          <FilePanel
            recordingArray={appData.recordingArray}
            setAppData={setAppData}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        <Box>
          <VideoPlayer recording={appData.selectedRecording} test={test} />
          <DanmakuPlayer
            recording={appData.selectedRecording}
            showDanmaku={appData.showDanmaku}
            danmakuOpacity={appData.danmakuOpacity}
            danmakuSpeed={appData.danmakuSpeed}
            test={test}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <Box sx={{ width: 300, p: 1 }}>
            <Slider
              value={appData.danmakuSpeed}
              defaultValue={144}
              valueLabelDisplay="auto"
              step={20}
              marks
              min={44}
              max={224}
              onChange={(e, value) => {
                setAppData((data) => ({
                  ...data,
                  danmakuSpeed: value as number,
                }));
              }}
            />
          </Box>
          <Box sx={{ width: 300, p: 1 }}>
            <Slider
              value={appData.danmakuOpacity}
              defaultValue={0.5}
              valueLabelDisplay="auto"
              step={0.1}
              marks
              min={0.1}
              max={1}
              onChange={(e, value) => {
                setAppData((data) => ({
                  ...data,
                  danmakuOpacity: value as number,
                }));
              }}
            />
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={appData.showDanmaku}
                onChange={() =>
                  setAppData((data) => ({
                    ...data,
                    showDanmaku: !appData.showDanmaku,
                  }))
                }
              />
            }
            label="Enable Danmaku"
          />
          <Button
            variant="outlined"
            onClick={() => {
              setTest(test + 1);
            }}
            color="success"
            sx={{ border: 1 }}
          >
            test
          </Button>
        </Box>
        <Box>
          <Copyright />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 1,
        }}
      ></Box>
    </Box>
  );
}
