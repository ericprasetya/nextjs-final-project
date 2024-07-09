import { useMutation } from "@/hooks/useMutation";
import React from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Switch,
  useColorMode,
  useColorModeValue,
  useToast,
  Text,
  chakra,
} from "@chakra-ui/react";

import NextLink from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";

const ChakraLink = chakra(NextLink);

export default function Login() {
  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue("gray.100", "gray.700");

  const router = useRouter();
  const toast = useToast();
  const { mutate } = useMutation();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const HandleSubmit = async () => {
    console.log("payload => ", payload);
    const response = await mutate({
      url: "https://service.pace-unv.cloud/api/login",
      payload: payload,
    });
    console.log("response => ", response);
    if (response.success == true) {
      console.log("Login Success");
      Cookies.set("user_token", response.data.token, {
        expires: new Date(response.data.expires_at),
        path: "/",
      });
      router.push("/");
    } else {
      toast({
        title: "Login Failed",
        description: response.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Flex h="100vh" alignItems="center" justifyContent="center">
      <Flex
        flexDirection="column"
        bg={formBackground}
        p={12}
        borderRadius={8}
        boxShadow="lg"
      >
        <Heading mb={6}>Log In</Heading>
        <Input
          value={payload.email}
          onChange={(e) => setPayload({ ...payload, email: e.target.value })}
          type="email"
          placeholder="johndoe@gmail.com"
          mb={3}
        />
        <Input
          value={payload.password}
          onChange={(e) => setPayload({ ...payload, password: e.target.value })}
          type="password"
          placeholder="Password"
          variant="filled"
          mb={6}
        />
        <Button onClick={HandleSubmit} colorScheme="teal" mb={8}>
          Submit
        </Button>
        <FormControl display="flex" alignItems="center" mb={8}>
          <Text mr={2}>New To Us? </Text>
          <ChakraLink color="teal.500" href="/register">
            Sign Up
          </ChakraLink>
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="dark_mode" mb="0">
            Enable Dark Mode?
          </FormLabel>
          <Switch
            id="dark_mode"
            colorScheme="teal"
            size="lg"
            onChange={toggleColorMode}
          />
        </FormControl>
      </Flex>
    </Flex>
  );
}
