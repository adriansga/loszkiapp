import { getTasks } from './actions';
import TasksClient from './TasksClient';

export const dynamic = 'force-dynamic';

export default async function ZadaniaPage() {
  const tasks = await getTasks();
  return <TasksClient initialTasks={tasks} />;
}
