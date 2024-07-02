import { BarcodeScanner } from "./scanner";

const accessToken =
   "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJRWlJkS3JabXJmMEk3WkhXRUtqNWRLTEhQanFubWJFeV9iNmpSbHdya1drIn0.eyJleHAiOjE3MTk5MDg5MTAsImlhdCI6MTcxOTkwNzcxMCwianRpIjoiMTg5MGZjM2UtYmU3NS00ODNkLWE0YWUtYjNjOWNiOTUzYWVhIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmF1LWF3cy50aGV3aXNobGlzdC5pby9hdXRoL3JlYWxtcy90d2NNYWluIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjI2YTIyNTAyLWRhNzQtNDhkMC1iZWFiLTgzY2E0YTlmMDdlOSIsInR5cCI6IkJlYXJlciIsImF6cCI6InR3Yy1wb3MtY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjYzYjE5MDZiLWVmNWMtNGUwZC04MzZjLTE2OTU0MjFkYjc5YSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9sb2NhbGhvc3QiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInR3Yy1wb3MtdXNlciIsIm9mZmxpbmVfYWNjZXNzIiwidHdjLXN0b3JlLW93bmVyIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InRlbmFudGlkIHN0b3JlIHByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInRlbmFudGlkIjoidmlrdG9yaWEtd29vZHMiLCJuYW1lIjoiTWF0dCBIYW1wc2hpcmUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJtYXR0QHRoZXdpc2hsaXN0LmlvIiwic3RvcmUiOiIyMDUiLCJnaXZlbl9uYW1lIjoiTWF0dCIsImZhbWlseV9uYW1lIjoiSGFtcHNoaXJlIiwiZW1haWwiOiJtYXR0QHRoZXdpc2hsaXN0LmlvIn0.r-bRRMyVMAPG_VlpKIBUddBstgCZb_jCwLbQcq4AsReIYdqAkm_AwBTY75uc3h7iO6Swf4Y9wQs6i2nUsvxIOKmJlZx_2ae3JxojJSgf7yvgdOfnVjSpDdUEEDLODs0klF5IE3ZGiNHxr74T87F_QDrUV0MV4zQSq56aLJYiKc1bHBHRXyWDsYYFtlpcrhuMuXaBIDI1XD5-Jx__AT8zBkLnHeYUBbY0hFBlxN1QhDfqQpPsOthqSmT1gaQNNspsIKjPZu8n-wB_e-0gsm7_o1VVgcZTSk1Mlj72K2QDjUc9JmDxEzMMELfnghcjFJd5vVEVomNbmo4wasy-RiqwGw";
const tenant = "viktoria-woods";
const customerRef = "6056901378182";
const scanner = new BarcodeScanner(accessToken, tenant, customerRef);
document.getElementById("reader-init").addEventListener("click", async () => {
   scanner.scanBarcode();
});
