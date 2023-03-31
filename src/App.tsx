import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Button } from '@mui/material';
import { MuiFileInput } from 'mui-file-input'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/y1guo/hotspot-clip-webui">
        hotspot-clip-webui
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function App() {
  const [appData, setAppData] = React.useState({});
  const [VideoFileArray, setVideoFileArray] = React.useState<File[]>([])
  const [xmlFileArray, setXmlFileArray] = React.useState<File[]>([])

  const handleChangeVideoFileArray = (newValue: File[]) => {
    setVideoFileArray(newValue)
  }

  const handleChangeXmlFileArray = (newValue: File[]) => {
    setXmlFileArray(newValue)
  }

  return (
    <Container maxWidth="sm">
      <Box>
        <MuiFileInput multiple value={VideoFileArray} onChange={handleChangeVideoFileArray} hideSizeText/>
        <MuiFileInput multiple value={xmlFileArray} onChange={handleChangeXmlFileArray} hideSizeText/>
      </Box>
      <Copyright />
    </Container>
  );
}

