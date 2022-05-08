import {
  Box,
  Button,
  Center,
  Flex,
  GridItem,
  SimpleGrid,
  Text,
  Link,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';

import { useRouter } from 'next/router';
import { InputField } from '../components/InputField';
import PageWrapper from '../components/PageWrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <PageWrapper variant="regular">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex
              justifyContent="center"
              alignItems="center"
              minH="80vh"
              h="100%"
            >
              <Box bg="white" borderRadius={10} p={10}>
                <SimpleGrid columns={4} columnGap={2} spacing={4}>
                  <GridItem colSpan={4}>
                    <InputField
                      name="usernameOrEmail"
                      label="Username or Email"
                      placeholder="username or email"
                      _size="lg"
                    />
                  </GridItem>

                  <GridItem colSpan={4}>
                    <InputField
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="password"
                      _size="lg"
                    />
                  </GridItem>
                  <GridItem colSpan={4}>
                    <Center>
                      <Button
                        type="submit"
                        variant="solid"
                        color="white"
                        bg="telegram.600"
                        _hover={{ bg: 'telegram.700' }}
                        my={5}
                        size="lg"
                        isLoading={isSubmitting}
                      >
                        Login
                      </Button>
                    </Center>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <Flex justifyContent="space-between" w="full">
                      <NextLink href="/register">
                        <Link>Register</Link>
                      </NextLink>
                      <NextLink href="/forgot-password">
                        <Link>Forgot Password?</Link>
                      </NextLink>
                    </Flex>
                  </GridItem>
                </SimpleGrid>
              </Box>
            </Flex>
          </Form>
        )}
      </Formik>
    </PageWrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
