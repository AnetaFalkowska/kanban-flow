import { Board } from './app/shared/board.model';
import { Column } from './app/shared/column.model';
import { Task } from './app/shared/task.model';

export const BoardData = [
  {
    name: 'JOB',
    columns: [
      {
        name: 'Todo',
        tasks: [
          { name: 'Send email', id: 'ef4855b0-b41e-4eae-8a24-6a527f55702a' },
          { name: 'Meeting', id: 'd324e2a4-bc3e-4123-ab67-479d46a6c8d2' },
          { name: 'Phone call', id: 'a1e68496-28a7-430a-8590-289569168155' },
        ],
        id: '7267c30f-2892-4c83-85b9-6c2930ce4695',
      },
      {
        name: 'In progress',
        tasks: [
          { name: 'Write report', id: '7abaf1d2-931f-4326-9f13-8e438875f3e1' },
          {
            name: 'Prepare presentation',
            id: 'd74b7de9-9a0b-47a8-a18f-dc8701c3a57e',
          },
          { name: 'Review code', id: '74d8b61b-2a5f-456b-a308-5f0b66d02d29' },
        ],
        id: '8d509bd4-dddc-4206-bdae-066c9a879b05',
      },
      {
        name: 'Done',
        tasks: [
          { name: 'Submit report', id: '7a0a2b38-779e-43b1-8dcd-ae6a3281d0f6' },
          {
            name: 'Send email follow-up',
            id: '2ede3dd1-4122-48e5-909b-bdd7a33cccf2',
          },
          { name: 'Code review', id: '52fb778a-efc0-4c39-9774-76eeaaac2f44' },
        ],
        id: '15b5b1d6-673a-4528-848c-bc59e11d43ec',
      },
    ],
    id: '87d8f5f3-f503-42b6-ac1c-3e9f903fb774',
  },
  {
    name: 'PERSONAL',
    columns: [
      {
        name: 'Todo',
        tasks: [
          { name: 'Buy groceries', id: '9a36c51f-7a02-4cdd-b6e5-b4c59a48678b' },
          {
            name: 'Clean the house',
            id: 'ecccaa43-000b-41d4-ac0d-e2d0f0eed230',
          },
          { name: 'Pay bills', id: '3ccca39d-4be8-4b2c-b757-e2d08cfeb55d' },
        ],
        id: '281c06a7-ce19-47a8-a140-9bd9e2972852',
      },
      {
        name: 'In progress',
        tasks: [
          {
            name: 'Learn TypeScript',
            id: '29a637f7-43ab-492c-9b91-3efa0d8df52e',
          },
          { name: 'Read a book', id: '6d05f808-431b-4975-afa7-9df93c4ba7a8' },
        ],
        id: 'b47838fd-27a8-4d49-b230-274f57aba263',
      },
      {
        name: 'Done',
        tasks: [
          { name: 'Exercise', id: 'e0e8f4e5-8a71-42b1-8cb2-19bf110a5760' },
          { name: 'Cook dinner', id: '42e5333a-6caf-4797-aef6-0d73c1f6911f' },
        ],
        id: 'ac5a9d16-1fcf-4f10-a534-b43465c57194',
      },
    ],
    id: '1e4e2b7e-ef9f-4ecc-b0a5-e6960831b774',
  },
  {
    name: 'TRAVEL',
    columns: [
      {
        name: 'Todo',
        tasks: [
          { name: 'Book tickets', id: 'fe37fbdd-cafd-4c38-8c05-a5278caf0b8b' },
          { name: 'Pack luggage', id: 'a55a36ef-7dc9-4c88-8faa-ce1f5da3d4b5' },
        ],
        id: 'e4cae3c1-c232-48e8-af16-0d910da47e89',
      },
      {
        name: 'In progress',
        tasks: [
          {
            name: 'Check weather forecast',
            id: 'c2e7b0a7-d96e-49a9-af51-fcc4111dcda6',
          },
          {
            name: 'Research destinations',
            id: 'fa14c076-1575-41e0-a13f-090864a442e9',
          },
        ],
        id: 'ae397b37-fcca-49f3-af4c-25732d8fc942',
      },
      {
        name: 'Done',
        tasks: [
          {
            name: 'Get travel insurance',
            id: '27076d59-7f79-4980-817f-602966bd6af9',
          },
        ],
        id: 'a3021770-6934-4d64-9907-37fa443c510c',
      },
    ],
    id: '21fc9c21-6bc6-4e97-ba3d-8965b71a3647',
  },
  {
    name: 'TRAINING',
    columns: [
      { name: 'Todo', tasks: [], id: 'e8c1e287-1dcf-46be-b5ca-4a627dde58dc' },
    ],
    id: '561c3cb7-e51e-4601-a1ef-5135c15b34ea',
  },
];

// export const BoardData = [
//   new Board('job', [
//     new Column('Todo', [
//       new Task('Send email'),
//       new Task('Meeting'),
//       new Task('Phone call'),
//     ]),
//     new Column('In progress', [
//       new Task('Write report'),
//       new Task('Prepare presentation'),
//       new Task('Review code'),
//     ]),
//     new Column('Done', [
//       new Task('Submit report'),
//       new Task('Send email follow-up'),
//       new Task('Code review'),
//     ]),
//   ]),

//   new Board('personal', [
//     new Column('Todo', [
//       new Task('Buy groceries'),
//       new Task('Clean the house'),
//       new Task('Pay bills'),
//     ]),
//     new Column('In progress', [
//       new Task('Learn TypeScript'),
//       new Task('Read a book'),
//     ]),
//     new Column('Done', [new Task('Exercise'), new Task('Cook dinner')]),
//   ]),

//   new Board('travel', [
//     new Column('Todo', [new Task('Book tickets'), new Task('Pack luggage')]),
//     new Column('In progress', [
//       new Task('Check weather forecast'),
//       new Task('Research destinations'),
//     ]),
//     new Column('Done', [new Task('Get travel insurance')]),
//   ]),
//   new Board('training', [new Column('Todo')]),
// ];
