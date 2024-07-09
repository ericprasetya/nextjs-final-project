// components/PostCard.js

import React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
} from "@chakra-ui/react";
import {
  FaHeart,
  FaComment,
  FaEllipsisV,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

const PostCard = ({
  post,
  handleEdit,
  handleDelete,
  handleLike,
  handleUnLike,
  handleReply,
}) => {
  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius={8}
      boxShadow="md"
      bg="white"
      position="relative"
    >
      {post.is_own_post && (
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
      )}

      <Flex mb={5} alignItems="center">
        <Avatar name={post.user.name} mr={3} />
        <Box>
          <Text fontWeight="bold">
            {post.user.name} {post.is_own_post && "(You)"}
          </Text>
          <Text>{post.description}</Text>
          <Text fontSize="xs">
            {new Date(post.created_at).toDateString()}{" "}
            {post.updated_at != post.created_at && "(EDITED)"}
          </Text>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <IconButton
          icon={<FaHeart color={post.is_like_post ? "red" : "gray"} />}
          onClick={() =>
            post.is_like_post ? handleUnLike(post.id) : handleLike(post.id)
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
  );
};

export default PostCard;
