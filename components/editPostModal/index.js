import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { useMutation } from "@/hooks/useMutation";
import Cookies from "js-cookie";

const EditPostModal = ({ isOpen, onClose, post, onSubmit }) => {
  const [editContent, setEditContent] = useState("");
  const { mutate } = useMutation();
  const toast = useToast();

  useEffect(() => {
    if (post) {
      setEditContent(post.description);
    }
  }, [post]);

  const handleSubmit = async () => {
    try {
      const response = await mutate({
        url: `https://service.pace-unv.cloud/api/post/update/${post.id}`,
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + Cookies.get("user_token"),
        },
        payload: { description: editContent },
      });
      if (response.success) {
        toast({
          title: "Edit Success",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        onSubmit(); // Reload data or perform any necessary action after edit
        onClose();
      } else {
        toast({
          title: "Edit Failed",
          description: response.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error editing post:", error);
      toast({
        title: "Error",
        description: "Failed to edit post.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  if (!post) {
    return null; // Optionally handle case where post is null or undefined
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edit your post here..."
            mb={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPostModal;
