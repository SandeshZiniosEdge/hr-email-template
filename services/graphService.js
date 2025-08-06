// services/graphService.js
const { ConfidentialClientApplication } = require("@azure/msal-node");
const { Client } = require("@microsoft/microsoft-graph-client");
const {
  TokenCredentialAuthenticationProvider,
} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
require("dotenv").config();

class GraphService {
  constructor() {
    // MSAL configuration
    this.clientConfig = {
      auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
      },
    };

    this.cca = new ConfidentialClientApplication(this.clientConfig);
    this.graphClient = null;
  }

  // Get access token using client credentials flow
  async getAccessToken() {
    try {
      const clientCredentialRequest = {
        scopes: ["https://graph.microsoft.com/.default"],
      };

      const response = await this.cca.acquireTokenByClientCredential(
        clientCredentialRequest
      );
      return response.accessToken;
    } catch (error) {
      console.error("Error acquiring token:", error);
      throw error;
    }
  }

  // Initialize Graph client
  async initGraphClient() {
    try {
      const accessToken = await this.getAccessToken();

      this.graphClient = Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        },
      });

      return this.graphClient;
    } catch (error) {
      console.error("Error initializing Graph client:", error);
      throw error;
    }
  }

  // Get all users in the organization
  async getAllUsers(options = {}) {
    try {
      if (!this.graphClient) {
        await this.initGraphClient();
      }

      const {
        select = "id,displayName,mail,userPrincipalName,department,jobTitle",
        top = 100,
        filter = null,
      } = options;

      let request = this.graphClient.api("/users").select(select).top(top);

      if (filter) {
        request = request.filter(filter);
      }

      const users = await request.get();
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(
    userId,
    select = "id,displayName,mail,userPrincipalName,department,jobTitle"
  ) {
    try {
      if (!this.graphClient) {
        await this.initGraphClient();
      }

      const user = await this.graphClient
        .api(`/users/${userId}`)
        .select(select)
        .get();

      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  // Search users by display name or email
  async searchUsers(searchTerm, options = {}) {
    try {
      if (!this.graphClient) {
        await this.initGraphClient();
      }

      const {
        select = "id,displayName,mail,userPrincipalName,department,jobTitle",
        top = 50,
      } = options;

      const filter = `startswith(displayName,'${searchTerm}') or startswith(mail,'${searchTerm}')`;

      const users = await this.graphClient
        .api("/users")
        .select(select)
        .filter(filter)
        .top(top)
        .get();

      return users;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  }

  // Get user's groups
  async getUserGroups(userId) {
    try {
      if (!this.graphClient) {
        await this.initGraphClient();
      }

      const groups = await this.graphClient
        .api(`/users/${userId}/memberOf`)
        .select("id,displayName,description,groupTypes")
        .get();

      return groups;
    } catch (error) {
      console.error("Error fetching user groups:", error);
      throw error;
    }
  }

  // Get users by department
  async getUsersByDepartment(department, options = {}) {
    try {
      const {
        select = "id,displayName,mail,userPrincipalName,department,jobTitle",
        top = 100,
      } = options;

      const filter = `department eq '${department}'`;

      return await this.getAllUsers({
        select,
        top,
        filter,
      });
    } catch (error) {
      console.error("Error fetching users by department:", error);
      throw error;
    }
  }

  // Get user's manager
  async getUserManager(userId) {
    try {
      if (!this.graphClient) {
        await this.initGraphClient();
      }

      const manager = await this.graphClient
        .api(`/users/${userId}/manager`)
        .select("id,displayName,mail,userPrincipalName,jobTitle")
        .get();

      return manager;
    } catch (error) {
      console.error("Error fetching user manager:", error);
      throw error;
    }
  }

  // Get user's direct reports
  async getUserDirectReports(userId) {
    try {
      if (!this.graphClient) {
        await this.initGraphClient();
      }

      const directReports = await this.graphClient
        .api(`/users/${userId}/directReports`)
        .select("id,displayName,mail,userPrincipalName,jobTitle")
        .get();

      return directReports;
    } catch (error) {
      console.error("Error fetching user direct reports:", error);
      throw error;
    }
  }
}

module.exports = new GraphService();
