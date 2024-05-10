import { useState, useEffect } from 'react';
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
    // Placeholder for fetching posts from the database
    setPosts([
      { id: 1, title: 'First Post', body: 'This is the first post', created_at: new Date().toISOString(), author_id: userId, reactions: [] }
    ]);
  };

  const handleLoginLogout = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const handlePostCreation = async () => {
    // Placeholder for creating a post in the database
    const newPost = { id: posts.length + 1, title: newPostTitle, body: newPostBody, created_at: new Date().toISOString(), author_id: userId, reactions: [] };
    setPosts([...posts, newPost]);
    setNewPostTitle('');
    setNewPostBody('');
  };

  const handleReaction = (postId, emoji) => {
    // Placeholder for handling reactions
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const existingReaction = post.reactions.find(reaction => reaction.emoji === emoji && reaction.user_id === userId);
        if (existingReaction) {
          post.reactions = post.reactions.filter(reaction => !(reaction.emoji === emoji && reaction.user_id === userId));
        } else {
          post.reactions.push({ id: post.reactions.length + 1, post_id: postId, user_id: userId, emoji });
        }
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleDeletePost = (postId) => {
    // Placeholder for deleting a post
    setPosts(posts.filter(post => post.id !== postId));
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