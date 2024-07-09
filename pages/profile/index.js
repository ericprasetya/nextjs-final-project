import dynamic from "next/dynamic";
import React, { useState } from "react";
import {
  Flex,
  Heading,
  Box,
  Text,
  Avatar,
  SimpleGrid,
  useColorModeValue,
  Button,
  Divider,
  Textarea,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import {
  FaHeart,
  FaComment,
  FaEllipsisV,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import { useQueries } from "@/hooks/useQueries";
import DeleteConfirmationModal from "@/components/deleteConfirmationModal";
import { set } from "date-fns";
import RepliesModal from "@/components/repliesModal";
import EditPostModal from "@/components/editPostModal";

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Profile() {
  const formBackground = useColorModeValue("gray.100", "gray.700");
  const userData = useContext(UserContext);
  console.log("userData => ", userData);

  const { mutate } = useMutation();
  const toast = useToast();
  const [payload, setPayload] = useState({
    description: "",
  });

  const [currentPostId, setCurrentPostId] = useState(null);
  const [replies, setReplies] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);

  const handleModalClose = () => {
    setisDeleteModalOpen(false);
    setDeletePost(null);
    setisEditModalOpen(false);
    setEditPost(null);
    setCurrentPostId(null);
    setIsReplyModalOpen(false);
    window.location.reload();
  };

  const { data, isLoading } = useQueries({
    prefixUrl: "https://service.pace-unv.cloud/api/posts?type=me",
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
    setIsReplyModalOpen(true);
  };

  const submitReply = async (postId, replyContent) => {
    if (replyContent.trim()) {
      try {
        const response = await mutate({
          url: `https://service.pace-unv.cloud/api/replies/post/${postId}`,
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

  const submitEdit = () => {
    // window.location.reload();
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setisEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeletePost(id);
    setisDeleteModalOpen(true);
  };

  const submitDelete = async () => {
    const response = await mutate({
      url: `https://service.pace-unv.cloud/api/post/delete/${deletePost}`,
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + Cookies.get("user_token"),
      },
    });
    if (response.success) {
      console.log("Delete Success");
      window.location.reload();
    } else {
      console.log("Delete Failed");
      toast({
        title: "Delete Failed",
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
        <Flex justifyContent="center" p={6}>
          <Box
            p={6}
            w="full"
            borderWidth={1}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            bg={formBackground}
          >
            <Flex justifyContent="center" mb={4}></Flex>
            <Heading fontSize="xl" textAlign="center">
              {userData?.name}
            </Heading>
            <Divider mb={4} />
            <Flex justifyContent="space-evenly">
              <Text>
                <strong>Email:</strong> {userData?.email}
              </Text>
              <Text>
                <strong>Phone:</strong> {userData?.phone}
              </Text>
              <Text>
                <strong>Hobby:</strong> {userData?.hobby}
              </Text>
              <Text>
                <strong>Joined:</strong>{" "}
                {new Date(userData?.created_at).toLocaleDateString()}
              </Text>
            </Flex>
          </Box>
        </Flex>
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
              position="relative" // Ensure the container is relative for absolute positioning of the menu
            >
              {/* Top right position for MenuButton */}
              <Menu placement="bottom-end">
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<FaEllipsisV />}
                  variant="ghost"
                  colorScheme="teal"
                  position="absolute"
                  top={2}
                  right={2}
                />
                <MenuList>
                  <MenuItem icon={<FaEdit />} onClick={() => handleEdit(post)}>
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<FaTrashAlt />}
                    color="red.500"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>

              <Text fontWeight="bold" mb={2}>
                {post.user.name}
              </Text>
              <Text mb={2}>{post.description}</Text>
              <Text mb={4}>
                {new Date(post.created_at).toLocaleDateString()}
              </Text>
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

        {/* modal for replies */}
        <RepliesModal
          isOpen={isReplyModalOpen}
          onClose={handleModalClose}
          postId={currentPostId}
          replies={replies}
          submitReply={submitReply}
        />

        {/* modal for confirm delete */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleModalClose}
          onDelete={submitDelete}
        />

        {/* modal for edit post */}
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          post={editPost}
          onSubmit={submitEdit}
        />
      </LayoutComponent>
    </>
  );
}
