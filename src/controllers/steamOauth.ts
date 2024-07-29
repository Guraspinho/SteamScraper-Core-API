import express from "express";
import {OAuth2Client} from "google-auth-library"

import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import asyncWrapper from "../middlewares/asyncWrapper";

import BadRequestError from "../errors/badRequest";
import NotFoundError from "../errors/notFound";
import UnauthenticatedError from "../errors/unauthenticated";

import User from "../models/users";
import GoogleUser from "../models/googleUsers";