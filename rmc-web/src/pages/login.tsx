import {
  Box,
  Button,
  Center,
  Flex,
  GridItem,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { InputField } from '../components/InputField';
import PageWrapper from '../components/PageWrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <PageWrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
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
              <Box bg="white" p={5} borderRadius={10}>
                <SimpleGrid columns={2} columnGap={2} spacing={4}>
                  <GridItem colSpan={2}>
                    <InputField
                      name="username"
                      label="Username"
                      placeholder="username"
                    />
                  </GridItem>

                  <GridItem colSpan={2}>
                    <InputField
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="password"
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Center>
                      <Button
                        type="submit"
                        variant="solid"
                        color="white"
                        bg="telegram.600"
                        _hover={{ bg: 'telegram.700' }}
                        my={5}
                        isLoading={isSubmitting}
                      >
                        Login
                      </Button>
                    </Center>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Center>
                      <Text>
                        don't have an account?{' '}
                        <Link href="/register">register</Link>
                      </Text>
                    </Center>
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

export default Login;
