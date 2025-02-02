import { createContext } from 'react'


interface RampValues {
  minimumDepositAmount: bigint | null;
  depositCounter: bigint | null;
  refetchDepositCounter: (() => void) | null;
  shouldFetchRampState: boolean;
}

const defaultValues: RampValues = {
  minimumDepositAmount: null,
  depositCounter: null,
  refetchDepositCounter: null,
  shouldFetchRampState: false
};

const RampContext = createContext<RampValues>(defaultValues)

export default RampContext
