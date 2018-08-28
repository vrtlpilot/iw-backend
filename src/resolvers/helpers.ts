export function formatPoolData(input) {
  const {
    poolName,
    verifyContractLink,
    holderOfPool,
    projectName,
    projectLink,
    projectAdress,
    poolSoftCap,
    poolHardCap,
    minDeposit,
    maxDeposit,
    endDate,
    comissionOfHolder,
    addressForComissionPayment,
    comissionOfIcoWorld
  } = input;

  return {
    poolName,
    verifyContractLink,
    holderOfPool,
    name: projectName,
    projectLink,
    wallet: {
      address: projectAdress
    },
    sum_min: poolSoftCap,
    sum_max: poolHardCap,
    sum_mbr_min: minDeposit,
    sum_mbr_max: maxDeposit,
    endDate: endDate,
    lead_comission: comissionOfHolder,
    addressForComissionPayment,
    comission: comissionOfIcoWorld
  }
}

export function getPoolData(pool) {
  return {
    poolId: pool._id,
    poolName: pool.poolName,
    verifyContractLink: pool.verifyContractLink,
    holderOfPool: pool.holderOfPool,
    projectName: pool.name,
    projectAdress: pool.wallet.address,
    poolSoftCap: pool.sum_min,
    poolHardCap: pool.sum_max,
    minDeposit: pool.sum_mbr_min,
    maxDeposit: pool.sum_mbr_max,
    endDate: pool.endDate,
    comissionOfHolder: pool.lead_comission,
    comissionOfIcoWorld: pool.comission,
  }
}

export function getPoolDataMini(pool) {
  return {
    poolName: pool.poolName,
    holderOfPool: pool.holderOfPool,
    projectName: pool.name,
    endDate: pool.endDate
  }
}