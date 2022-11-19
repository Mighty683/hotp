import { SelectAlgorithmMap, SelectOCRAAlgorithmMap } from "./types";

export const WebAlgorithmsMap: SelectAlgorithmMap = {
  "sha-1": "SHA-1",
  "sha-256": "SHA-256",
  "sha-512": "SHA-512",
};

export const NodeAlgorithmsMap: SelectAlgorithmMap = {
  "sha-1": "sha1",
  "sha-256": "sha256",
  "sha-512": "sha512",
};

export const OCRAAlgorithmMap: SelectOCRAAlgorithmMap = {
  SHA1: "sha-1",
  SHA256: "sha-1",
  SHA512: "sha-1",
};

export const OCRA_QUESTION_BYTE_LENGTH = 128;
