import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    GridItem,
    Input,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { InputField } from '../components/InputField';
import PageWrapper from '../components/PageWrapper';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
    return (
        <PageWrapper variant="small">
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={(vals) => {
                    console.log(vals);
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
                                <SimpleGrid
                                    columns={2}
                                    columnGap={2}
                                    spacing={4}
                                >
                                    <GridItem colSpan={[2, 1]}>
                                        <InputField
                                            name="firstName"
                                            label="First Name"
                                            placeholder="John"
                                            disabled
                                        />
                                    </GridItem>
                                    <GridItem colSpan={[2, 1]}>
                                        <InputField
                                            name="lastName"
                                            label="Last Name"
                                            placeholder="Doe"
                                            disabled
                                        />
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        <InputField
                                            name="username"
                                            label="Username"
                                            placeholder="username"
                                        />
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        <InputField
                                            name="email"
                                            label="Email"
                                            placeholder="john.doe@mail.com"
                                            disabled
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

export default Register;
