import dynamic from "next/dynamic";

const LayoutComponent = dynamic(() => import("@/layout"));

import { useQueries } from "@/hooks/useQueries";
import React from "react";
import {
  Flex,
  Heading,
  Button,
  Box,
  Textarea,
  SimpleGrid,
  IconButton,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { FaHeart, FaComment } from "react-icons/fa";
import { useState } from "react";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";

export default function Main({}) {
  const { mutate } = useMutation();
  const toast = useToast();
  const [payload, setPayload] = useState({
    description: "",
  });
  const [replyContent, setReplyContent] = useState("");
  const [currentPostId, setCurrentPostId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [replies, setReplies] = useState([]);

  const { data, isLoading } = useQueries({
    prefixUrl: "https://service.pace-unv.cloud/api/posts?type=all",
    headers: {
      Authorization: "Bearer " + Cookies.get("user_token"),
    },
  });
  console.log("data => ", data);

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

  const handleLike = async (postId) => {
    const response = await mutate({
      url: `https://service.pace-unv.cloud/api/likes/post/${postId}`,
      method: "POST",
      headers: {
        Authorization: "Bearer " + Cookies.get("user_token"),
      },
    });
    console.log("response => ", response);

    if (response.success) {
      console.log("Like Success");
      window.location.reload();
    } else {
      console.log("Like Failed");
      toast({
        title: "Like Failed",
        description: response.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleUnLike = async (postId) => {
    const response = await mutate({
      url: `https://service.pace-unv.cloud/api/unlikes/post/${postId}`,
      method: "POST",
      headers: {
        Authorization: "Bearer " + Cookies.get("user_token"),
      },
    });
    console.log("response => ", response);

    if (response.success) {
      console.log("UnLike Success");
      window.location.reload();
    } else {
      console.log("UnLike Failed");
      toast({
        title: "Like Failed",
        description: response.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleReply = async (postId) => {
    setCurrentPostId(postId);
    try {
      const response = await fetch(
        `https://service.pace-unv.cloud/api/replies/post/${postId}`,
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("user_token"),
          },
        }
      );
      const data = await response.json();
      console.log("replies => ", data);
      setReplies(data.data);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
    onOpen();
  };

  const submitReply = async () => {
    if (replyContent.trim()) {
      try {
        const response = await mutate({
          url: `https://service.pace-unv.cloud/api/replies/post/${currentPostId}`,
          method: "POST",
          payload: { description: replyContent },
          headers: {
            Authorization: "Bearer " + Cookies.get("user_token"),
          },
        });
        setReplyContent("");
        onClose();
        window.location.reload();
      } catch (error) {
        console.error("Error replying to post:", error);
        toast({
          title: "Error",
          description: "Failed to reply to post.",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    } else {
      toast({
        title: "Empty Reply",
        description: "Reply content cannot be empty.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const closeModal = () => {
    window.location.reload();
    onClose();
  };

  return (
    <>
      <LayoutComponent metaTitle="Home">
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
        <SimpleGrid columns={[1, null, 2, 3, 4, 5]} spacing={5} mt={6}>
          {data?.data.map((post) => (
            <Box
              key={post.id}
              p={4}
              borderWidth={1}
              borderRadius={8}
              boxShadow="md"
              bg="white"
            >
              <Text fontWeight="bold" mb={2}>
                {post.user.name}
              </Text>
              <Text mb={2}>{post.description}</Text>
              <Text mb={4}>{new Date(post.created_at).toLocaleDateString()}</Text>
              <Flex justifyContent="space-between" alignItems="center">
                <IconButton
                  icon={<FaHeart color={post.is_like_post ? "red" : "gray"} />}
                  onClick={() =>
                    post.is_like_post
                      ? handleUnLike(post.id)
                      : handleLike(post.id)
                  }
                  aria-label="Like"
                  colorScheme="teal"
                  variant="outline"
                  mr={2}
                />
                <Text>{post.likes_count} Likes</Text>
                <IconButton
                  icon={<FaComment />}
                  onClick={() => handleReply(post.id)}
                  aria-label="Reply"
                  colorScheme="teal"
                  variant="outline"
                />
                <Text>{post.replies_count} Replies</Text>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Reply to Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply here..."
                mb={4}
              />
              <Button colorScheme="blue" mr={3} onClick={submitReply}>
                Submit
              </Button>
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Box mt={6}>
                {replies.map((reply) => (
                  <Box
                    key={reply.id}
                    p={2}
                    borderWidth={1}
                    borderRadius={8}
                    boxShadow="md"
                    mb={2}
                  >
                    <Text fontWeight="bold">{reply.user.name}</Text>
                    <Text>{reply.description}</Text>
                  </Box>
                ))}
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </LayoutComponent>
    </>
  );
}
