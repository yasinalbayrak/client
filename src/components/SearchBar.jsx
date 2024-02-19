
import { Box, TextField, Typography, Container, Button } from "@mui/material";
import React, { useEffect } from "react";


export default function SearchBar(props) {

    const [searchTerm, setSearchTerm] = React.useState('')

    useEffect(() => {
        console.log(searchTerm);
    }
    , [searchTerm]);

    const {handleSearch, empty} = props;

    return (
        <Container sx={{bgcolor:'#EFEDED', borderRadius:2, border:1, pt:1, pb:1}}>
            <Box justifyContent='center' display='flex' flexDirection='column'>
                <TextField
                id="outlined-basic" 
                label="Search" 
                variant="outlined" 
                size="small" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{paddingInline:0.5}}
                ></TextField>

                <Box display='flex' justifyContent='space-between' sx={{height:1, width:1, pt:1}}>
                <Button sx={{ bgcolor:'green', borderRadius:2, color:'white', ":hover":{bgcolor:'black'}}} onClick={(e)=>handleSearch(e,searchTerm)}> Search </Button>
                <Button sx={{width:0.4, borderRadius:2, color:'black', ml:0.5, ":hover":{bgcolor:''}}} onClick={()=>{setSearchTerm(''); empty()} }> Clear </Button>
                </Box>
                

            </Box>
        </Container>
    );
}