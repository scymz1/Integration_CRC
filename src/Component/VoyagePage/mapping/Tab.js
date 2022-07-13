import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function IntraTabs() {
  const [value, setValue] = React.useState('emb');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    //TODO: set search object based on embarkation/disembarkation
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
      >
        <Tab
          value="emb"
          label="Port of embarkation"
        />
        <Tab value="disemb" label="Port of disembarkation" />
      </Tabs>
    </Box>
  );
}
