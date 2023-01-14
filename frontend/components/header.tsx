import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { CustomConnect } from "./CustomConnectButton";

export default function Header() {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const router = useRouter();
  const [isDarkMode, setDarkMode] = useState<boolean>(false);
  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(!checked);
    toggleColorMode();
  };

  const { colorMode, toggleColorMode } = useColorMode();

  let pages: string[] = ["Home", "Generate Poll"];
  let paths: string[] = ["/", "/generatepoll"];

  return (
    <Box as="section" pb={{ base: "12", md: "25" }}>
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Container py={{ base: "4", lg: "5" }} maxWidth="100%">
          <HStack justify="space-between">
            <HStack justify="space-between">
              <Flex justify="space-between" flex="1">
                <Box width={12} mr={5} mt={2}>
                  <Image src="/zkpoll_logo.png" />
                </Box>
                <ButtonGroup variant="link" spacing="8">
                  {[0, 1].map((pageIndex) => (
                    <Button
                      key={pageIndex}
                      onClick={() => router.push(paths[pageIndex])}
                    >
                      {pages[pageIndex]}
                    </Button>
                  ))}
                </ButtonGroup>
              </Flex>
            </HStack>
            <HStack alignContent={"center"}>
              {/* <img src='https://i.imgur.com/okZ0qOy.png' width={40} alt="ZKPoll"/> */}
            </HStack>
            <HStack verticalAlign={"top"}>
              <HStack ml={4} mr={4}>
                {/* <ConnectButton /> */}
                <CustomConnect />
              </HStack>
              <DarkModeSwitch
                style={{ marginRight: "2", marginTop: "0" }}
                checked={colorMode === "light"}
                onChange={toggleDarkMode}
                size={30}
                sunColor="white"
                moonColor="black"
              />
            </HStack>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
