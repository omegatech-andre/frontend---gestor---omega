import { useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function ProviderTheme() {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.lg})`);
  const isSmallDevice = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);
  return { colorScheme, isDesktop, isSmallDevice };
}
