
export const chainRPC = {
    "56": "https://binance.llamarpc.com",
    "1337": "http://127.0.0.1:8545/",
  };
  
  export const dexContract: { [key in keyof typeof chainRPC]: string } = {
    "56": "0x4BBEEB066ED09B7AeD07bf39eEE0460DFA261525",
    "1337": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  } as const;
  
  export const stackingContract: { [key in keyof typeof chainRPC]: string } = {
    "56": "0x4BBEEB066ED09B7AeD07bf39eEE0460DFA261525",
    "1337": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  } as const;

  export const cossContract: { [key in keyof typeof chainRPC]: string } = {
    "56": "0x4BBEEB066ED09B7AeD07bf39eEE0460DFA261525",
    "1337": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  } as const;
  
  export const erc20ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function transfer(address to, uint amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];
  
  export const dexABI = [
    "event NewTrade(address indexed _taker, uint _orderHash, uint _amount, uint _fees, uint _baseFees, uint _isSeller)",
    "event Cancel(uint _orderHash)",
  ];
  
  export const stackingABI = [
    "event NewStackDeposit(uint _slot, uint _amount, address _sender)",
    "event NewStackWithdrawal(uint _slot, uint _amount, address _sender)",
    "event NewFeesDeposit(uint _slot, uint _amount, address _token)",
    "event NewFeesWithdrawal(uint _slot, address[] _tokens, address _sender)",
  ];
  