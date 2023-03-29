import { tokens } from "../theme";

export const mockDataTeam = [
    {
        id: 1,
        serialNo: 1234567891234567,
        givenCredit: 50,
        remarkName: "playerx",
        redemptionAcc: "boss",
        createdAt: "2023-03-28T09:08:18.248+00:00",
        updatedAt: "2023-03-28T09:08:18.248+00:00",
        serialStatus: true,
    },
    {
        id: 2,
        serialNo: 4510020476251944,
        givenCredit: 20,
        remarkName: "playery",
        redemptionAcc: "jax",
        createdAt: "2023-03-28T09:08:18.248+00:00",
        updatedAt: "2023-03-28T09:08:18.248+00:00",
        serialStatus: true,
    },
    {
        id: 3,
        serialNo: 6331820457956130,
        givenCredit: 15,
        remarkName: "playerz",
        redemptionAcc: "kobe",
        createdAt: "2023-03-28T09:08:18.248+00:00",
        updatedAt: "2023-03-28T09:08:18.248+00:00",
        serialStatus: false,
    },
    {
        id: 4,
        serialNo: 1137249851224368,
        givenCredit: 5,
        remarkName: "xplayer",
        redemptionAcc: "jakcy",
        createdAt: "2023-03-28T09:08:18.248+00:00",
        updatedAt: "2023-03-28T09:08:18.248+00:00",
        serialStatus: false,
    },
    {
        id: 5,
        serialNo: 9600412452289862,
        givenCredit: 30,
        remarkName: "yplayer",
        redemptionAcc: "ribena",
        createdAt: "2023-03-28T09:08:18.248+00:00",
        updatedAt: "2023-03-28T09:08:18.248+00:00",
        serialStatus: true,
    },
];

export const mockLineData = [
    {
        id: "Redeemed",
        color: tokens("dark").greenAccent[500],
        data: [
            {
                x: "Jan",
                y: 101,
            },
            {
                x: "Feb",
                y: 600,
            },
            {
                x: "Mar",
                y: 700,
            },
            {
                x: "Apr",
                y: 0,
            },
            {
                x: "May",
                y: 0,
            },
            {
                x: "Jun",
                y: 0,
            },
            {
                x: "Jul",
                y: 0,
            },
            {
                x: "Aug",
                y: 0,
            },
            {
                x: "Sep",
                y: 0,
            },
            {
                x: "Oct",
                y: 0,
            },
            {
                x: "Nov",
                y: 0,
            },
            {
                x: "Dec",
                y: 0,
            },
        ],
    },
    {
        id: "Sold",
        color: tokens("dark").blueAccent[300],
        data: [
            {
                x: "Jan",
                y: 212,
            },
            {
                x: "Feb",
                y: 590,
            },
            {
                x: "Mar",
                y: 770,
            },
            {
                x: "Apr",
                y: 0,
            },
            {
                x: "May",
                y: 0,
            },
            {
                x: "Jun",
                y: 0,
            },
            {
                x: "Jul",
                y: 0,
            },
            {
                x: "Aug",
                y: 0,
            },
            {
                x: "Sep",
                y: 0,
            },
            {
                x: "Oct",
                y: 0,
            },
            {
                x: "Nov",
                y: 0,
            },
            {
                x: "Dec",
                y: 0,
            },
        ],
    },    
];


export const mockTransactions = [
  {
    txId: "01e4dsa",
    user: "johndoe",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "51034szv",
    user: "goodmanave",
    date: "2022-11-05",
    cost: "200.95",
  },
  {
    txId: "0a123sb",
    user: "stevebower",
    date: "2022-11-02",
    cost: "13.55",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "120s51a",
    user: "wootzifer",
    date: "2019-04-15",
    cost: "24.20",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
];