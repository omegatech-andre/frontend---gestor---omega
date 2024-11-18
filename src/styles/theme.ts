"use client";
import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  primaryColor: 'red',
  fontFamily: 'Alata, sans-serif',
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
  colors: {
    red: [
      "#ffe9e9",
      "#ffd0d0",
      "#fd9d9d",
      "#fc6766",
      "#fc3c39",
      "#fc231c",
      "#fd160e",
      "#e20a03",
      "#c90000",
      "#b00000"
    ]
  }
});
