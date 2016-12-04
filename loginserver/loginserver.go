package main

import (
  "net/http"
	"log"
	"flag"
	"encoding/json"
)

type loginInformation struct {
  AuthData *struct {
    Username string
    Password string
  }
}

type serverData struct {
  Role string `json:"role"`
}

type responseInfo struct {
  Username string `json:"username"`
  ServerData serverData
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
  loginInfo := loginInformation{}
  decoder := json.NewDecoder(r.Body)
  err := decoder.Decode(&loginInfo)
  
  if err != nil {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  if loginInfo.AuthData.Username == "speaker" && 
    loginInfo.AuthData.Password != "6936522507f99568facc7e52d1aa3955abc0febd" {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  w.Header().Set("Content-Type", "application/json;charset=utf-8")
  role := "attendee"
  if loginInfo.AuthData.Username == "speaker" {
    role = "speaker"
  }

  jw := json.NewEncoder(w)
  re := responseInfo{
    Username: loginInfo.AuthData.Username,
    ServerData: serverData{
      Role: role,
    },
  }
  err = jw.Encode(re)
  if err != nil {
    log.Println("error encoding response json:", re, err)
    w.WriteHeader(http.StatusInternalServerError)
    return
  }
  log.Println("auth successful for user:", loginInfo.AuthData.Username, "role:", role)
}

func main() {
  listen := flag.String("listen", "localhost:9002", "Listen address/port")
  log.Println("Starting login server...")
  http.HandleFunc("/login", loginHandler)
  http.ListenAndServe(*listen, nil)
}