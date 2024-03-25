
export const chainRPC = {
    "56": "https://binance.llamarpc.com",
  };
  
  export const dexContract: { [key in keyof typeof chainRPC]: string } = {
    "56": "0x4BBEEB066ED09B7AeD07bf39eEE0460DFA261525",
  } as const;
  
  export const stackingContract: { [key in keyof typeof chainRPC]: string } = {
    "56": "0x4BBEEB066ED09B7AeD07bf39eEE0460DFA261525",
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
  