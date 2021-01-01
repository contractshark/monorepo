pragma solidity ^0.5.11;

import "@0xcert/ethereum-utils-contracts/src/contracts/math/safe-math.sol";

contract Token2 {
  using SafeMath for uint256;

  /**
   * @dev Returns fake value.
   * @param _value Multiploer value.
   */
  function test () 
    public
    pure
    returns (uint256 _value)
  {
    uint256 a = 123456;
    uint256 b = a.add(1);
    _value = b;
  }

}
