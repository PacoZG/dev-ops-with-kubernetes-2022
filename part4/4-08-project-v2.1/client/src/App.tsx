import {
  Container,
  MantineProvider,
  createStyles,
  Title,
  Text,
  TextInput,
  Global,
  ActionIcon,
  List,
  Group,
  Image,
  Button,
  ThemeIcon,
} from "@mantine/core";
import {
  Plus,
  Check,
  CircleDashed,
  CircleCheck,
  InfoCircle,
} from "tabler-icons-react";
import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "react-query";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

const useStyles = createStyles({
  root: {
    width: "calc(100% - 260px)",
    maxWidth: 820,
    marginLeft: "auto",
    marginRight: "auto",
  },
});

function get(resource: string) {
  return fetch(`${SERVER_URL}/${resource}`);
}

function post(resource: string, body: object) {
  return fetch(`${SERVER_URL}/${resource}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function put(resource: string, query: string) {
  return fetch(`${SERVER_URL}/${resource}?${query}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function App() {
  const { classes } = useStyles();
  const [todo, setTodo] = useState("");
  const todos = useQuery<{ id: string; message: string; done: boolean }[]>(
    "todos",
    () => get("todos").then((r) => r.json()),
    {
      initialData: [],
    }
  );

  const addTodoMutation = useMutation((newTodo: { message: string }) => {
    return post("todos", newTodo);
  });

  const markTodoDoneMutation = useMutation((id: string) => {
    return put("todos", `id=${id}`);
  });

  const dailyPic = useQuery("daily-pic", () =>
    get("daily-pic").then((r) =>
      r.blob().then((b) => (window.URL || window.webkitURL).createObjectURL(b))
    )
  );

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddTodo();
  };

  const handleAddTodo = () => {
    if (todo === "") {
      return;
    }

    addTodoMutation.mutate(
      { message: todo },
      { onSuccess: () => todos.refetch() }
    );
    setTodo("");
  };

  const handleMarkTodoDone = (id: string) => {
    markTodoDoneMutation.mutate(id, { onSuccess: () => todos.refetch() });
  };

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <Global
        styles={(theme) => ({
          "html body": {
            color: "white",
            backgroundColor: theme.colors.dark[6],
          },
        })}
      />
      <Container className={classes.root}>
        <Group my={24} align="center">
          <Image
            width={50}
            height={50}
            radius="md"
            src={dailyPic.data || ""}
            alt="Daily image"
          />
          <Title>Todo App</Title>
        </Group>
        <form onSubmit={handleFormSubmit}>
          <TextInput
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            label="New entry"
            placeholder="Take out the trash!"
            rightSection={
              <ActionIcon onClick={handleAddTodo} disabled={todo === ""}>
                <Plus />
              </ActionIcon>
            }
          />
        </form>
        <Title mt={12} order={3}>
          In progress
        </Title>
        <List pt={12}>
          {todos.data
            ?.filter((d) => !d.done)
            .map((t) => (
              <List.Item
                key={t.id}
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <CircleDashed size={16} />
                  </ThemeIcon>
                }
              >
                <Group>
                  <Text>{t.message}</Text>
                  <ActionIcon
                    color="blue"
                    onClick={() => handleMarkTodoDone(t.id)}
                  >
                    <Check />
                  </ActionIcon>
                </Group>
              </List.Item>
            ))}
          {todos.data?.filter((t) => !t.done).length === 0 && (
            <List.Item
              icon={
                <ThemeIcon color="indigo" size={24} radius="xl">
                  <InfoCircle size={16} />
                </ThemeIcon>
              }
            >
              <Text color="gray">
                Nothing to do, except to drink water and sleep! :)
              </Text>
            </List.Item>
          )}
        </List>
        <Title mt={12} order={3}>
          Done
        </Title>
        <List pt={12}>
          {todos.data
            ?.filter((d) => d.done)
            .map((t) => (
              <List.Item
                key={t.id}
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <CircleCheck size={16} />
                  </ThemeIcon>
                }
              >
                <Text>{t.message}</Text>
              </List.Item>
            ))}
          {todos.data?.filter((t) => t.done).length === 0 && (
            <List.Item
              icon={
                <ThemeIcon color="indigo" size={24} radius="xl">
                  <InfoCircle size={16} />
                </ThemeIcon>
              }
            >
              <Text color="gray">You have not completed any todos! :/</Text>
            </List.Item>
          )}
        </List>
      </Container>
    </MantineProvider>
  );
}

export default App;
