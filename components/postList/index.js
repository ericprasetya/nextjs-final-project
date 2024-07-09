// components/PostList.js

import React, { useState, useEffect } from "react";
import {
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import { useQueries } from "@/hooks/useQueries";
import PostCard from "@/components/postCard";
import RepliesModal from "@/components/repliesModal";
import DeleteConfirmationModal from "@/components/deleteConfirmationModal";
import EditPostModal from "@/components/editPostModal";

const PostList = ({ url }) => {
  const { mutate } = useMutation();
  const toast = useToast();
  const [currentPostId, setCurrentPostId] = useState(null);
  const [replies, setReplies] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);

  const { data, isLoading } = useQueries({
    prefixUrl: url,
    headers: {
      Authorization: "Bearer " + Cookies.get("user_token"),
    },
  });
  console.log("data => ", data);

  const handleLike = async (postId) => {
    const response = await mutate({
      url: `https://service.pace-unv.cloud/api/likes/post/${postId}`,
      method: "POST",
      headers: {
        Authorization: "Bearer " + Cookies.get("user_token"),
      },
    });

    if (response.success) {
      toast({
        title: "Like Success",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      window.location.reload();
    } else {
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

    if (response.success) {
      toast({
        title: "Unlike Success",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      window.location.reload();
    } else {
      toast({
        title: "Unlike Failed",
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
        window.location.reload();
        setIsReplyModalOpen(false);
      } catch (error) {
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
      toast({
        title: "Delete Success",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      window.location.reload();
      setisDeleteModalOpen(false);
    } else {
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

  const handleModalClose = () => {
    setisDeleteModalOpen(false);
    setDeletePost(null);
    setisEditModalOpen(false);
    setEditPost(null);
    setCurrentPostId(null);
    setIsReplyModalOpen(false);
    window.location.reload();
  };

  return (
    <>
      <SimpleGrid columns={[1, null, 2, 3, 4, 5]} spacing={5} mt={6}>
        {data?.data.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
            handleReply={handleReply}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
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
      />
    </>
  );
};

export default PostList;
