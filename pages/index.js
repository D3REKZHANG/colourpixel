import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useRef, useEffect } from 'react'
import { DialogContent, DialogActions, DialogTitle, Dialog, IconButton, MenuItem, Select, Button, Slider, Grid, Input } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';

import { scalePixels } from "../processing.js";

export default function Home() {

    // STATES AND REFS
    const [image, setImage] = useState(null);
    const [imageData, setImageData] = useState(null);

    const [settingsOpen, setSettingsOpen] = useState(false);

    // options
    const [scaleStyle, setScaleStyle] = useState("block");
    const [scale, setScale] = useState(1);

    const canvas = useRef(null);

    
    // EVENT HANDLERS
    
    const handleUpload = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState === 2){
                const img = new Image;
                img.src = reader.result;
                img.onload = () =>{
                    setImage(img);
                }
            }
        }
        reader.readAsDataURL(e.target.files[0])
    };

    const handleStyleChange = (e) => setScaleStyle(e.target.value);

    const handleSettingsClick = (e) => setSettingsOpen(true);
    const handleSettingsClose = (e) => setSettingsOpen(false);


    // USE EFFECT HOOKS
    
    useEffect(()=>{
        if(image === null) return;

        const ctx = canvas.current.getContext('2d');
        ctx.drawImage(image,0,0,500,image.height*(500/image.width));
        const imgData = ctx.getImageData(0,0,500,image.height*(500/image.width));
        setImageData(imgData);
        console.log("yert");
    },[image]);

    useEffect(()=>{
        console.log("changed");
    }, [imageData]);

    useEffect(()=>{
        if(image == null) return;
        const ctx = canvas.current.getContext('2d');
        ctx.putImageData(scalePixels(ctx, imageData, scale, scaleStyle),0,0);
    },[scale]);


    return (
        <div className={styles.container}>
            <Head>
                <title>Pixel Palette</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>P I X E L P A L E T T E </h1>
            <input type="file" id="upload" accept="image/*"onChange={handleUpload} style={{display:"none"}}/>
            <Button color="primary"> <label for="upload">Select file</label> </Button>
            <canvas id="display" width={(image===null)?0:500} height={(image === null)?0:image.height*(500/image.width)} style={{border:((image==null)?0:1)+"px solid #000000"}} ref={canvas}></canvas>

            <div style={{visibility:(image===null)?"hidden":"visible", width:"350px", margin:"30px"}}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography> Scale </Typography>
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={typeof scale === 'number' ? scale : 0}
                            onChange={(e, newval) => setScale(newval)}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            marks
                            defaultValue = {1} step = {1} min={1} max={10}
                        />
                    </Grid>
                    <Grid item>
                        <IconButton color="primary" onClick={handleSettingsClick}> <SettingsIcon /> </IconButton>
                    </Grid>
                </Grid>
            </div>
            <Dialog disableBackdropClick disableEscapeKeyDown open={settingsOpen}>
                <DialogTitle>Settings</DialogTitle>
                <DialogContent>
                    <Select
                        value={scaleStyle}
                        onChange={handleStyleChange}
                    > 
                        <MenuItem value={"block"}>Block</MenuItem>
                        <MenuItem value={"average"}>Average</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSettingsClose} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
