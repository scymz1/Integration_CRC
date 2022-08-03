import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Button, Modal, Box, Container, Avatar, ListItem,Dialog,TablePagination, CardMedia, Typography, Grid, Link } from "@mui/material";
import "universalviewer/dist/esm/index.css";
import { init } from "universalviewer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {useWindowSize} from '@react-hook/window-size'
import axios from "axios";
import { SettingsOverscanOutlined } from "@mui/icons-material";
import { alpha } from "@mui/material";
const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
function useUniversalViewer(ref, options) {
    const [uv, setUv] = useState();
  
    useLayoutEffect(() => {
      const currentUv = init(ref.current, options);
      setUv(currentUv);
  
      return () => {
        currentUv.dispose();
      };
    }, []);
  
    return uv;
  }

const UV = ({ manifest, parentWidth }) => {
  const el = useRef();
  const viewer = useUniversalViewer(
    el,
    {
      manifest,
    }
  );
  return <div ref={el} 
              className="uv" 
              style={{
                        width: "50vw",
                        height: "50vh"
                    }}/>;
};
function curImage(src){
  var arr1 = src.split("medium");
  return arr1[0] + "square" + arr1[1];
  
}
export default function Archive() {
    const [width, height] = useWindowSize()
    const [manifest, setManifest]= useState({});
    const [open, setOpen] = useState(false);
    const [apiUrl,setapiurl] = useState([])
    const [itemData, setData] = useState([])

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(16);
    const [total, setTotal] = useState(0)

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleOpen = (manifest) => {
      setOpen(true);
      setManifest(manifest)}
    const handleClose = () => setOpen(false);
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        p: 4,
        // overflow: "scroll",
        maxHeight: 500,
      };

      useEffect(()=>{
        var data = new FormData();
        fetch('https://voyages3-api.crc.rice.edu/docs/',{
          method: 'POST',
          body: data,
          headers: {'Authorization':AUTH_TOKEN}
        }).then(res=>setTotal(parseInt(res.headers.get("total_results_count"))));
      },[])

      useEffect(()=>{
        const fetchData = async () => {
        var data = new FormData();
        data.append("hierarchical", "False");
        data.append("selected_fields", 'url');
        data.append("results_per_page", rowsPerPage);
        data.append("results_page", page + 1);
        const res = await fetch('https://voyages3-api.crc.rice.edu/docs/',{
          method: 'POST',
          body: data,
          headers: {'Authorization':AUTH_TOKEN}
        })
        const result = await res.json();
        setapiurl(result)
      }
        fetchData().catch(console.error);
      },[page,rowsPerPage])

      useEffect(() => {
        const fetchData = async ()=> {
          const promises = apiUrl.map(uri => {
            return fetch(Object.values(uri), {
              method: "GET",
            }).then(res => res.json()).then(res => {
              var dict = {"title": res.label.none[0], "image": curImage(res.thumbnail[0].id),"uri":uri}
              return dict;
            })
          })
          const response = await Promise.all(promises)
          setData(response)
          // console.log(itemData)
        }
        fetchData().catch(console.error);
      }, [apiUrl])
    // console.log(itemData)

    return (
        <div>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[16, 25, 36, 49, 64]}
            />
            <Grid  container spacing={{ xs: 2, md: 2, lg:2}} padding={{ xs: 4, md: 3, lg:4 }}>
            {/* <ImageList sx={{ width: width, height: height }} cols={parseInt(width/300)} gap={20} > */}
              {itemData.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} width="40vh" >
                      <Box sx={{ position: 'relative' }} >
                        <LazyLoadImage
                          effect="blur"
                          src={item.image}
                          width='100%'
                          height="100%"
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height:{xs:"2em", sm:"2.7em"},
                            // bgcolor: 'rgba(0, 0, 0, 0.54)',
                            bgcolor: "rgba(123,139,111, 0.7)",
                            // padding: '10px',
                            // py: {xs: 0, md: '0.4em', lg:'0.2em'},
                            margin: '0',
                            fontStyle: 'italic',
                            textAlign: "center",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          
                        >
                          {/* <Typography variant="h4.Heading">Title</Typography> */}
                          <Typography variant="body3"color="#FFFFFF" component={Link} underline="hover">
                            <Link href="#" underline="hover" color="#FFFFFF" onClick={() => handleOpen(item.uri.url)}>{item.title}</Link>
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                // <ImageListItem key={item.image}>
                //   <LazyLoadImage
                //     src={`${item.image}?w=248&fit=crop&auto=format`}
                //     srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                //     alt={item.title}
                //     loading="lazy"
                //     effect="blur"
                //   />
                //   <ImageListItemBar
                //     title={item.title}
                //     sx ={{
                //       bgcolor: alpha('#549165',0.8)
                //     }}
                //     actionIcon={
                //       <IconButton
                //         sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                //         aria-label={`info about ${item.title}`}
                //         onClick={() => handleOpen(item.uri.url)}
                //       >
                //         <InfoIcon />
                //       </IconButton>
                //     }
                //   />
                // </ImageListItem>
              ))}
            </Grid>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <UV manifest={manifest} />
                </Box>
            </Modal>
        </div>
    );
}