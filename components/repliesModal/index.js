import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  useToast,
  Box,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";

const RepliesModal = ({ isOpen, onClose, postId, replies, submitReply }) => {
  const [replyContent, setReplyContent] = useState("");
  const toast = useToast();

  const handleReplySubmit = async () => {
    if (replyContent.trim()) {
      try {
        await submitReply(postId, replyContent);
        setReplyContent("");
        onClose();
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
          <Button colorScheme="blue" mr={3} onClick={handleReplySubmit}>
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
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
  );
};

export default RepliesModal;
