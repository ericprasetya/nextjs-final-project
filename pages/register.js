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
} from "@chakra-ui/react";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router";
import { useState } from "react";
import { format } from "date-fns";
import { chakra } from "@chakra-ui/react";
import NextLink from "next/link";


export default function Register() {
  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const ChakraLink = chakra(NextLink);

  const router = useRouter();
  const toast = useToast();
  const { mutate } = useMutation();
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    dob: null, // Use null for the initial value
    phone: "",
    hobby: "",
  });

  const HandleSubmit = async () => {
    console.log("payload => ", payload);
    const response = await mutate({
      url: "https://service.pace-unv.cloud/api/register",
      payload: payload,
    });
    console.log("response => ", response);
    if (response.success) {
      console.log("Register Success");
      router.push("/login");
    } else {
      toast({
        title: "Register Failed",
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
        <Heading mb={6}>Register</Heading>
        <Input
          value={payload.name}
          onChange={(e) => setPayload({ ...payload, name: e.target.value })}
          type="text"
          placeholder="John Doe"
          mb={3}
        />
        <Input
          value={payload.email}
          onChange={(e) => setPayload({ ...payload, email: e.target.value })}
          type="email"
          placeholder="johndoe@gmail.com"
          mb={3}
        />
        <ReactDatePicker
          selected={payload.dob}
          onChange={(date) => setPayload({ ...payload, dob: format(date, "yyyy-MM-dd")  })}
          dateFormat="yyyy-MM-dd"
          placeholderText="yyyy-MM-dd"
          customInput={<Input mb={3} />}
        />
        <Input
          value={payload.phone}
          onChange={(e) => setPayload({ ...payload, phone: e.target.value })}
          type="text"
          placeholder="08XXXXXXXXXX"
          mb={3}
        />
        <Input
          value={payload.hobby}
          onChange={(e) => setPayload({ ...payload, hobby: e.target.value })}
          type="text"
          placeholder="Hobby"
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
          <Text mr={2}>Already Have an Account? </Text>
          <ChakraLink color="teal.500" href="/login">
            Log In
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
