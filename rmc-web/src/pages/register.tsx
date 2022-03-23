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
import { useMutation } from 'urql';
import { InputField } from '../components/InputField';
import PageWrapper from '../components/PageWrapper';

interface registerProps {}

const REGISTER_MUT = `
mutation Register($username: String!, $password: String!){
    register(options: {username: $username, password: $password}){
        errors{
            field
            message
        }
        user{
            id
            createdAt
            updatedAt
            username
        }
    }
}
`;

const Register: React.FC<registerProps> = ({}) => {
    const [, register] = useMutation(REGISTER_MUT);
    return (
        <PageWrapper variant="small">
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={(values) => {
                    console.log(values);
                    register(values);
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
