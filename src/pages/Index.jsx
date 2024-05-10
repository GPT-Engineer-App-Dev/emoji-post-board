import axios from 'axios';
import { useState, useEffect } from 'react';
const apiClient = axios.create({
  baseURL: 'https://nvfxbesbgohafwkbhsvv.supabase.co/rest/v1',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52ZnhiZXNiZ29oYWZ3a2Joc3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNTcwMjcsImV4cCI6MjAzMDczMzAyN30.2VLc7SxL3hYJ_lpO4YnMrvGKViKUIBKdooZLyZ4NL5Q',
    'Content-Type': 'application/json'
  }
});
import { Container, VStack, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, useDisclosure, Box, IconButton } from '@chakra-ui/react';
import { FaRegSmile } from 'react-icons/fa';

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userId = '91f3b2c7-bb2d-428e-876b-eb30e60fcae7';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get('/posts?select=*');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const handlePostCreation = async () => {
    try {
      const newPost = { title: newPostTitle, body: newPostBody, author_id: userId };
      const response = await apiClient.post('/posts', newPost);
      setPosts([...posts, response.data]);
      setNewPostTitle('');
      setNewPostBody('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleReaction = async (postId, emoji) => {
    try {
      const existingReaction = posts.find(post => post.id === postId).reactions.find(reaction => reaction.emoji === emoji && reaction.user_id === userId);
      if (existingReaction) {
        await apiClient.delete(`/reactions?id=eq.${existingReaction.id}`);
      } else {
        await apiClient.post('/reactions', { post_id: postId, user_id: userId, emoji });
      }
      fetchPosts();  // Refresh posts to reflect changes
    } catch (error) {
      console.error('Failed to update reactions:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await apiClient.delete(`/posts?id=eq.${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <Container maxW="container.md" p={4}>
      <VStack spacing={4}>
        <Box alignSelf="flex-end">
          <Button onClick={handleLoginLogout}>{isLoggedIn ? 'Logout' : 'Login'}</Button>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isLoggedIn ? 'Create Post' : 'Login'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isLoggedIn ? (
                <>
                  <Input placeholder="Title" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
                  <Input placeholder="Body" value={newPostBody} onChange={(e) => setNewPostBody(e.target.value)} />
                </>
              ) : (
                <Input placeholder="Password" type="password" />
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={isLoggedIn ? handlePostCreation : onOpen}>
                {isLoggedIn ? 'Post' : 'Login'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <VStack divider={<Box borderColor="gray.200" borderWidth={1} selfStretch />} spacing={4}>
          {posts.map(post => (
            <Box key={post.id} p={4} shadow="md" borderWidth="1px">
              <Text fontWeight="bold">{post.title}</Text>
              <Text>{post.body}</Text>
              <Text fontSize="sm">Posted on: {new Date(post.created_at).toLocaleString()}</Text>
              <IconButton aria-label="React with smile" icon={<FaRegSmile />} onClick={() => handleReaction(post.id, '😊')} />
              {post.author_id === userId && (
                <Button size="sm" colorScheme="red" onClick={() => handleDeletePost(post.id)}>Delete</Button>
              )}
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;