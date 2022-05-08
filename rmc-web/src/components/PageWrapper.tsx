import { Box } from '@chakra-ui/react';

interface PageWrapperProps {
  variant?: 'small' | 'regular';
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  variant = 'regular',
}) => {
  return (
    <Box
      maxW={variant === 'regular' ? '800px' : '500px'}
      mx="auto"
      w="100%"
      mt={12}
      p={5}
    >
      {children}
    </Box>
  );
};

export default PageWrapper;
