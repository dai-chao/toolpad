import * as React from 'react';
import { Typography } from '@mui/material';
import { createComponent } from '@mui/toolpad/browser';

export interface HelloWorldProps {
  msg: string;
}

function HelloWorld({ msg }: HelloWorldProps) {
  return <Typography>{msg}</Typography>;
}

export default createComponent(HelloWorld, {
  argTypes: {
    msg: {
      type: 'string',
      default: 'Hello world!',
    },
  },
});