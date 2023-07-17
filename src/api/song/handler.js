/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const ClientError = require("../../exceptions/ClientError");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
     this._validator.validateSongPayload(request.payload);

     const songId = await this._service.addSong(request.payload);

     const response = h.response({
       status: "success",
       message: "Song berhasil ditambahkan",
       data: {
         songId,
       },
     });

     response.code(201);
     return response;
  }

  async getAllSongsHandler(request) {
    const params = request.query;
    const songs = await this._service.getAllSongs(params);
    return {
      status: "success",
      data: {
        songs: songs.map((s) => ({
          id: s.id,
          title: s.title,
          performer: s.performer,
        })),
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: "success",
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request, h) {
     this._validator.validateSongPayload(request.payload);
     const { id } = request.params;

     const response = await this._service.editSongById(id, request.payload);

     return {
       status: "success",
       message: "Song berhasil diperbarui",
       response,
     };
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: "success",
      message: "Song berhasil dihapus",
    };
  }
}

module.exports = SongsHandler;
