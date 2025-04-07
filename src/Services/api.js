import axios from "axios"

// Base URL for API endpoints
const API_BASE_URL = "https://api.example.com"

// Helper function to format currency
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Helper function to format percentage
export const formatPercentage = (value) => {
  return `${value}%`
}

// Customer Type API
export const fetchCustomerTypeData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customer-type`)

    // For development/demo purposes, return mock data if API is not available
    if (!response.data) {
      return getMockCustomerTypeData()
    }

    return response.data
  } catch (error) {
    console.error("Error fetching customer type data:", error)
    // Return mock data for development/demo
    return getMockCustomerTypeData()
  }
}

// Account Industry API
export const fetchAccountIndustryData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/account-industry`)

    // For development/demo purposes, return mock data if API is not available
    if (!response.data) {
      return getMockAccountIndustryData()
    }

    return response.data
  } catch (error) {
    console.error("Error fetching account industry data:", error)
    // Return mock data for development/demo
    return getMockAccountIndustryData()
  }
}

// ACV Range API
export const fetchACVRangeData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/acv-range`)

    // For development/demo purposes, return mock data if API is not available
    if (!response.data) {
      return getMockACVRangeData()
    }

    return response.data
  } catch (error) {
    console.error("Error fetching ACV range data:", error)
    // Return mock data for development/demo
    return getMockACVRangeData()
  }
}

// Team API
export const fetchTeamData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/team`)

    // For development/demo purposes, return mock data if API is not available
    if (!response.data) {
      return getMockTeamData()
    }

    return response.data
  } catch (error) {
    console.error("Error fetching team data:", error)
    // Return mock data for development/demo
    return getMockTeamData()
  }
}

// Mock data functions for development/demo purposes
const getMockCustomerTypeData = () => {
  return {
    data: [
      {
        quarter: "2023-Q3",
        existingCustomer: { acv: 1322310, opps: 46, percentage: 57 },
        newCustomer: { acv: 983031, opps: 14, percentage: 43 },
        total: { acv: 2305341, opps: 60, percentage: 100 },
      },
      {
        quarter: "2023-Q4",
        existingCustomer: { acv: 1124857, opps: 45, percentage: 74 },
        newCustomer: { acv: 387300, opps: 10, percentage: 26 },
        total: { acv: 1512157, opps: 55, percentage: 100 },
      },
      {
        quarter: "2024-Q1",
        existingCustomer: { acv: 1360047, opps: 51, percentage: 81 },
        newCustomer: { acv: 313189, opps: 6, percentage: 19 },
        total: { acv: 1673236, opps: 57, percentage: 100 },
      },
      {
        quarter: "2024-Q2",
        existingCustomer: { acv: 647821, opps: 23, percentage: 74 },
        newCustomer: { acv: 224643, opps: 6, percentage: 26 },
        total: { acv: 872464, opps: 29, percentage: 100 },
      },
    ],
    summary: {
      existingCustomer: { acv: 4455035, opps: 165, percentage: 70 },
      newCustomer: { acv: 1908163, opps: 36, percentage: 30 },
      total: { acv: 6363198, opps: 201, percentage: 100 },
    },
  }
}

const getMockAccountIndustryData = () => {
  return {
    data: [
      { industry: "Technology", acv: 2545279, opps: 80, percentage: 40 },
      { industry: "Financial Services", acv: 1272640, opps: 40, percentage: 20 },
      { industry: "Healthcare", acv: 954480, opps: 30, percentage: 15 },
      { industry: "Manufacturing", acv: 636320, opps: 20, percentage: 10 },
      { industry: "Retail", acv: 636320, opps: 20, percentage: 10 },
      { industry: "Other", acv: 318160, opps: 11, percentage: 5 },
    ],
    summary: {
      total: { acv: 6363199, opps: 201, percentage: 100 },
    },
  }
}

const getMockACVRangeData = () => {
  return {
    data: [
      { range: "$0-$25K", acv: 636320, opps: 60, percentage: 10 },
      { range: "$25K-$50K", acv: 1272640, opps: 50, percentage: 20 },
      { range: "$50K-$100K", acv: 1908960, opps: 40, percentage: 30 },
      { range: "$100K-$250K", acv: 1590800, opps: 30, percentage: 25 },
      { range: "$250K+", acv: 954480, opps: 21, percentage: 15 },
    ],
    summary: {
      total: { acv: 6363200, opps: 201, percentage: 100 },
    },
  }
}

const getMockTeamData = () => {
  return {
    data: [
      { team: "Enterprise", acv: 2545280, opps: 50, percentage: 40 },
      { team: "Mid-Market", acv: 1908960, opps: 70, percentage: 30 },
      { team: "SMB", acv: 1272640, opps: 60, percentage: 20 },
      { team: "Strategic", acv: 636320, opps: 21, percentage: 10 },
    ],
    summary: {
      total: { acv: 6363200, opps: 201, percentage: 100 },
    },
  }
}

