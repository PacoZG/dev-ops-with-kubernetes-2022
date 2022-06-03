import {
  Container,
  MantineProvider,
  createStyles,
  Title,
  TextInput,
  Global,
  ActionIcon,
  List,
  Group,
  Image,
} from "@mantine/core";
import { Plus } from "tabler-icons-react";
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

function App() {
  const { classes } = useStyles();
  const [todo, setTodo] = useState("");
  const todos = useQuery<{ id: string; message: string }[]>(
    "todos",
    () => get("todos").then((r) => r.json()),
    {
      initialData: [],
    }
  );
  const todosMutation = useMutation((newTodo: { message: string }) => {
    return post("todos", newTodo);
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
    todosMutation.mutate(
      { message: todo },
      { onSuccess: () => todos.refetch() }
    );
    setTodo("");
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
              <ActionIcon>
                <Plus />
              </ActionIcon>
            }
          />
        </form>
        <List pt={12}>
          {todos.data?.map((t) => (
            <List.Item key={t.id}>{t.message}</List.Item>
          ))}
        </List>
      </Container>
    </MantineProvider>
  );
}

export default App;
