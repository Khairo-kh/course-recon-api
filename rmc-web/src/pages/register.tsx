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
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { InputField } from '../components/InputField';
import PageWrapper from '../components/PageWrapper';
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <PageWrapper variant="regular">
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
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
              <Box bg="white" p={10} borderRadius={10}>
                <SimpleGrid columns={2} columnGap={2} spacing={4}>
                  <GridItem colSpan={[2, 1]}>
                    <InputField
                      name="firstName"
                      label="First Name"
                      placeholder="John"
                      _size="lg"
                      disabled
                    />
                  </GridItem>
                  <GridItem colSpan={[2, 1]}>
                    <InputField
                      name="lastName"
                      label="Last Name"
                      placeholder="Doe"
                      _size="lg"
                      disabled
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <InputField
                      name="username"
                      label="Username"
                      placeholder="username"
                      _size="lg"
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <InputField
                      name="email"
                      label="Email"
                      placeholder="john.doe@mail.com"
                      _size="lg"
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <InputField
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="password"
                      _size="lg"
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
                        Sign Up
                      </Button>
                    </Center>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Center>
                      <Text>
                        Already have an account?{' '}
                        <Link href="/login">Login</Link>
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

export default withUrqlClient(createUrqlClient)(Register);
