import dynamic from "next/dynamic";
import React, { useState } from "react";
import {
  Flex,
  Heading,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import PostList from "@/components/postList";

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Home() {
  const userData = useContext(UserContext);
  console.log("userData => ", userData);

  const { mutate } = useMutation();
  const toast = useToast();
  const [payload, setPayload] = useState({
    description: "",
  });

  const HandleSubmit = async () => {
    console.log("payload => ", payload);
    const response = await mutate({
      url: "https://service.pace-unv.cloud/api/post",
      method: "POST",
      payload: payload,
      headers: {
        Authorization: "Bearer " + Cookies.get("user_token"),
      },
    });
    console.log("response => ", response);
    if (response.success) {
      console.log("Post Success");
      window.location.reload();
    } else {
      console.log("Post Failed");
      toast({
        title: "Post Failed",
        description: response.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <LayoutComponent metaTitle="Profile">
        <Flex flexDirection="column" p={12} borderRadius={8} boxShadow="lg">
          <Heading mb={6}>Upload Post</Heading>
          <Textarea
            value={payload.description}
            onChange={(e) =>
              setPayload({ ...payload, description: e.target.value })
            }
            type="text"
            placeholder="Upload Post"
            mb={3}
          />
          <Button onClick={HandleSubmit} colorScheme="teal" mb={4}>
            Submit
          </Button>
        </Flex>
        <PostList url={`https://service.pace-unv.cloud/api/posts?type=all`} />
      </LayoutComponent>
    </>
  );
}
