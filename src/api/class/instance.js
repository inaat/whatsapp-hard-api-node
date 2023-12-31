/* eslint-disable no-unsafe-optional-chaining */
const ffmpegPath = require('@ffmpeg-installer/ffmpeg')
const { exec } = require('child_process')
const fetch = require('node-fetch');
const QRCode = require('qrcode')
const pino = require('pino')
const { promisify } = require('util');


let intervalStore = []
const {
  	makeWASocket,
    DisconnectReason,
	isJidUser,
	isJidGroup,
	makeInMemoryStore,
	proto,
	delay,
	useMultiFileAuthState,
	fetchLatestBaileysVersion,
	makeCacheableSignalKeyStore
	
	
	

	
	
} = require('@whiskeysockets/baileys')
const { unlinkSync } = require('fs')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const processButton = require('../helper/processbtn')
const generateVC = require('../helper/genVc')
//const Chat = require('../models/chat.model')
const axios = require('axios')
const config = require('../../config/config')
const downloadMessage = require('../helper/downloadMsg')
//const logger = require('pino')()
const dados = makeInMemoryStore({pino})
const fs = require('fs').promises;
const getMIMEType  = require('mime-types')
const readFileAsync = promisify(fs.readFile);

const url = require('url');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))


	dados.readFromFile('db/mensagens.json')
		
		setInterval(() => 
	{
			
   dados.writeToFile('db/mensagens.json');
	
	
	}, 7200000);


class WhatsAppInstance {
	
	
	
	

   		socketConfig = {		
        defaultQueryTimeoutMs: undefined,
        printQRInTerminal: false,
		logger: pino({
            level: config.log.level,
        			})
			
		 //markOnlineOnConnect:false
    				}


    key = ''
    authState
    allowWebhook = undefined
    webhook = undefined

    instance = {
        key: this.key,
        chats: [],
		contacts: [],
        qr: '',
        messages: [],
        qrRetry: 0,
        customWebhook: '',
		WAPresence:[],
		deleted:false,
		
    }

    axiosInstance = axios.create({
        baseURL: config.webhookUrl,
    })


    constructor(key, allowWebhook, webhook) {
		
        this.key = key ? key : uuidv4()
        this.instance.customWebhook = this.webhook ? this.webhook : webhook
        this.allowWebhook = config.webhookEnabled
            ? config.webhookEnabled
            : allowWebhook
	        if (this.allowWebhook && this.instance.customWebhook !== null) {
            this.allowWebhook = true
            this.instance.customWebhook = webhook
            this.axiosInstance = axios.create({
                baseURL: webhook,
            })
        }
	
		

    }



async convertToMP4(audioSource) {
	
  try {
     
    let audioBuffer;
	 if (Buffer.isBuffer(audioSource)) 
	 
	 {
		 audioBuffer = audioSource;
	 }

    else if (audioSource.startsWith('http')) {
      const response = await fetch(audioSource);
      audioBuffer = await response.buffer();
    } else if (audioSource.startsWith('data:audio')) {
      
      const base64DataIndex = audioSource.indexOf(',');
      if (base64DataIndex !== -1) {
        const base64Data = audioSource.slice(base64DataIndex + 1);
        audioBuffer = Buffer.from(base64Data, 'base64');
      }
    } else {
      
      audioBuffer = audioSource;
    }

    const tempOutputFile = `temp/temp_output_${Date.now()}.opus`;
	  const mp3_temp ='temp/temp_audio_input.mp3';

    const ffmpegCommand = `${ffmpegPath.path} -i "${mp3_temp}"  -c:a libopus -b:a 128k -ac 1 "${tempOutputFile}"`;

  
   await fs.writeFile(mp3_temp, Buffer.from(audioBuffer));
	  
    await new Promise((resolve, reject) => {
      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          
          reject(error);
        } else {
        
          resolve();
        }
      });
    });

  
    fs.unlink(mp3_temp);

    return tempOutputFile;
  } catch (error) {
    //console.error('Erro durante a conversão para MP4:', error);
    throw error;
  }
}

async convertTovideoMP4(videoSource) {
  try {
    let videoBuffer;

    if (Buffer.isBuffer(videoSource)) {
      videoBuffer = videoSource;
    } else if (videoSource.startsWith('http')) {
      const response = await fetch(videoSource);
      videoBuffer = await response.buffer();
    } else if (videoSource.startsWith('data:video')) {
      const base64DataIndex = videoSource.indexOf(',');
      if (base64DataIndex !== -1) {
        const base64Data = videoSource.slice(base64DataIndex + 1);
        videoBuffer = Buffer.from(base64Data, 'base64');
      }
    } else {
      videoBuffer = videoSource;
    }

    const tempOutputFile = `temp/temp_output_${Date.now()}.mp4`;
	  const mp4 = 'temp/temp_audio_input.mp4';

    const ffmpegCommand = `${ffmpegPath.path} -i "${mp4}"  -c:v libx264 -c:a aac -strict experimental -b:a 192k -movflags faststart -f mp4 "${tempOutputFile}"`;

    await fs.writeFile(mp4, Buffer.from(videoBuffer));
	  
    await new Promise((resolve, reject) => {
      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          
          reject(error);
        } else {
        
          resolve();
        }
      });
    });

  
    fs.unlink(mp4);

    return tempOutputFile;
  } catch (error) {
    //console.error('Erro durante a conversão para MP4:', error);
    throw error;
  }
}



async getMimeTypeFromBase64(base64String) {
  return new Promise((resolve, reject) => {
    try {
      
      const header = base64String.substring(0, base64String.indexOf(','));

     
      const match = header.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);

      if (match && match[1]) {
        resolve(match[1]);
      } else {
        reject(new Error('Tipo MIME não pôde ser determinado.'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async getBufferFromMP4File(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async getFileNameFromUrl(url) {
  try {
    const pathArray = new URL(url).pathname.split('/');
    const fileName = pathArray[pathArray.length - 1];
    return fileName;
  } catch (error) {
  
    throw error;
  }
}



async dataBase()
{
	try
		{
			
			 return  await useMultiFileAuthState('db/'+this.key)
			
			
		}
	catch(error)
		{
			console.log('Falha ao atualizar a base de dados')
		}
	
}



    async SendWebhook(type, hook, body, key) {
		const data = await this.instanceFind(key)
	
		if (data.webhook===false)
				{ 
					return
				}
		        
		const hasMessagesSet = data.webhookEvents.includes(hook)
	
		if(hasMessagesSet ===true)
			
			{
				
		this.web = axios.create({
                baseURL: data.webhookUrl,
            })
        this.web
            .post('', {
                type,
                body,
                instanceKey: key,
            })
            .catch(() => { })
				
			}
    }



async instanceFind(key) {
		const filePath = path.join('sessions.json');

           
            const data = await fs.readFile(filePath, 'utf-8');
	if(data){
            const sessions = JSON.parse(data);

		 const existingSession = sessions.find(session => session.key === this.key);
		if(!existingSession)
			{
				
			const data ={ 
			"key":false,
			"browser":false,
			"webhook":false,
			"base64":false,
            "webhookUrl": false,
			"webhookEvents": false,
			"messagesRead": false
						}
				return data	
				}
				
			
	else
		{
			return existingSession
		}
	}
	else
		{
			const data ={ 
			"key":false,
			"browser":false,
			"webhook":false,
			"base64":false,
            "webhookUrl": false,
			"webhookEvents": false,
			"messagesRead": false
						}
				return data	
			
		}
		  
    }

    async init() {
		
			const ver = await fetchLatestBaileysVersion()

		//console.log(this.key)
			const filePath = path.join('sessions.json');
			
           
            const data = await fs.readFile(filePath, 'utf-8');
		if(!data)
			{
				
				return
			}
            const sessions = JSON.parse(data);

            
            const existingSession = sessions.find(session => session.key === this.key);
		if(!existingSession)
			{
				return
			}

          
                const  { state, saveCreds, keys} = await this.dataBase()
                this.authState = { state: state, saveCreds: saveCreds, keys: makeCacheableSignalKeyStore(keys,this.logger) }
		
		
                //sessions.push({ key: this.key, webhook:this.allowWebhook, webhookUrl:this.instance.customWebhook});
               //await fs.writeFile(filePath, JSON.stringify(sessions, null, 2), 'utf-8');
		
		let b;
		let ignoreGroup;
		if(existingSession)
			{
           b = {
  browser: {
    platform: existingSession.browser,
    browser: 'chrome',
    version: '22.5.0',
  }
}; 
	ignoreGroup = existingSession.ignoreGroups			
			}
		else
			{
				
				 b = {
  browser: {
    platform: 'Chrome (Linux)',
    browser: 'chrome',
    version: '22.5.0',
  }
}; 
	ignoreGroup = false	
				
			}



		
		
     
       
        this.socketConfig.auth = this.authState.state
		 if (ignoreGroup===true) {
            this.socketConfig.shouldIgnoreJid = jid => !isJidUser(jid);
        }
		else
			{
				this.socketConfig.shouldIgnoreJid = jid => false;
			}
		this.socketConfig.version = ver.version
        this.socketConfig.browser = Object.values(b.browser)
        this.instance.sock = makeWASocket(this.socketConfig)
		
		dados?.bind(this.instance.sock?.ev)
		
        this.setHandler()
        return this
		
    }



    setHandler() {


        const sock = this.instance.sock
			

         
        sock?.ev.on('creds.update', this.authState.saveCreds)
		
		

        
		
		 
        sock?.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update
		
			//console.log(update)	
		//console.log(lastDisconnect?.error?.output?.statusCode)

            if (connection === 'connecting')return 

            if (connection === 'close') {
                // reconnect if not logged out
                if (
                    lastDisconnect?.error?.output?.statusCode !==
                    DisconnectReason.loggedOut
                ) {
		//await this.deleteFolder('db/'+this.key)
		
                    await this.init()
                } else {
		await this.deleteFolder('db/'+this.key)
		if(!this.instance.deleted==true)
		{
		
                    await this.init()
		}
                    this.instance.online = false
                }

               
                await this.SendWebhook('connection','connection.update', {
                    connection: connection,
                }, this.key)
            } else if (connection === 'open') {
               
				
				
                this.instance.online = true
                
                await this.SendWebhook('connection','connection.update', {
                    connection: connection,
                }, this.key)
            }

            if (qr) {
                QRCode.toDataURL(qr).then((url) => {
                    this.instance.qr = url
                    
                })
				await this.SendWebhook('qrCode','qrCode.update', {
                    qr: qr,
                }, this.key)
            }
        })

        // sending presence
        sock?.ev.on('presence.update', async (json) => {
	
           
            await this.SendWebhook('presence','presence.update', json, this.key)
        })
		
		
	sock?.ev.on('contacts.upsert', async (contacts) => {
		
	
 const folderPath = 'db/'+this.key; 

const filePath = path.join(folderPath, 'contacts.json');
	
try{
      await fs.access(folderPath);

  
    const currentContent = await fs.readFile(filePath, 'utf-8');
    const existingContacts = JSON.parse(currentContent);

  
   contacts.forEach((contact) => {
      const existingContactIndex = existingContacts.findIndex(
        (c) => c.id === contact.id
      );

      if (existingContactIndex !== -1) {
     
        existingContacts[existingContactIndex] = contact;
      } else {
        
        existingContacts.push(contact);
      }
    });

   
    await fs.writeFile(filePath, JSON.stringify(existingContacts, null, 2), 'utf-8');
    
} catch (error) {
    
    await fs.mkdir(folderPath, { recursive: true }); 
    await fs.writeFile(filePath, JSON.stringify(contacts, null, 2), 'utf-8');
    
}


                await this.SendWebhook('contacts','contacts.upsert', contacts, this.key)
           
});
		
		
	
      
       sock?.ev.on('chats.upsert', async(newChat) => {
            
          await this.SendWebhook('chats','chats.upsert', newChat, this.key)   
       })
		
		

    
       

       
        sock?.ev.on('chats.delete',  async(deletedChats) => {
        
             await this.SendWebhook('chats','chats.delete', deletedChats, this.key)
        })
		
		 sock?.ev.on('messages.update', async (m) => {
		
	
                await this.SendWebhook('updateMessage','messages.update', m, this.key)
		
})

				

        // on new mssage
        sock?.ev.on('messages.upsert', async (m) => {
        
		
            if (m.type === 'prepend')
                this.instance.messages.unshift(...m.messages)
            if (m.type !== 'notify') return

           const config = await this.instanceFind(this.key)
            

            this.instance.messages.unshift(...m.messages)
						
			

            m.messages.map(async (msg) => {
                if (!msg.message) return
						
	   if (config.messagesRead===true) {
                
                //await sock.readMessages(unreadMessages)
				await this.lerMensagem(msg.key.id, msg.key.remoteJid);	
	   
	  
						
            }

                const messageType = Object.keys(msg.message)[0]
                if (
                    [
                        'protocolMessage',
                        'senderKeyDistributionMessage',
                    ].includes(messageType)
                )
                    return

                const webhookData = {
                    key: this.key,
                    ...msg,
                }

                if (messageType === 'conversation') {
                    webhookData['text'] = m
					
                }

                if (config.base64===true) {
                    switch (messageType) {
                        case 'imageMessage':
                            webhookData['msgContent'] = await downloadMessage(
                                msg.message.imageMessage,
                                'image'
                            )
                            break
                        case 'videoMessage':
                            webhookData['msgContent'] = await downloadMessage(
                                msg.message.videoMessage,
                                'video'
                            )
                            break
                        case 'audioMessage':
                            webhookData['msgContent'] = await downloadMessage(
                                msg.message.audioMessage,
                                'audio'
                            )
                            break
							 case 'documentMessage':
                            webhookData['msgContent'] = await downloadMessage(
                                msg.message.documentMessage,
                                'document'
                            )
                            break
                        default:
                            webhookData['msgContent'] = ''
                            break
                    }
                }
                
                await this.SendWebhook('message','messages.upsert', webhookData, this.key)
            })
        })

        
		
		
		

		
		
        sock?.ws.on('CB:call', async (data) => {
            if (data.content) {
                if (data.content.find((e) => e.tag === 'offer')) {
                    const content = data.content.find((e) => e.tag === 'offer')
                    
                    await this.SendWebhook('call_offer','call.events', {
                        id: content.attrs['call-id'],
                        timestamp: parseInt(data.attrs.t),
                        user: {
                            id: data.attrs.from,
                            platform: data.attrs.platform,
                            platform_version: data.attrs.version,
                        },
                    }, this.key)
                } else if (data.content.find((e) => e.tag === 'terminate')) {
                    const content = data.content.find(
                        (e) => e.tag === 'terminate'
                    )

                 
                    await this.SendWebhook('call','call.events', {
                        id: content.attrs['call-id'],
                        user: {
                            id: data.attrs.from,
                        },
                        timestamp: parseInt(data.attrs.t),
                        reason: data.content[0].attrs.reason,
                    }, this.key)
                }
            }
        })

        sock?.ev.on('groups.upsert', async (newChat) => {
            //console.log('groups.upsert')
            //console.log(newChat)
            
            await this.SendWebhook('updateGroups','groups.upsert', {
                data: newChat,
            }, this.key)
        })

        sock?.ev.on('groups.update', async (newChat) => {
            //console.log('groups.update')
            //console.log(newChat)
            //this.updateGroupSubjectByApp(newChat)
          
            await this.SendWebhook('updateGroups','groups.update', {
                data: newChat,
            }, this.key)
        })

        sock?.ev.on('group-participants.update', async (newChat) => {
            //console.log('group-participants.update')
            //console.log(newChat)
            //this.updateGroupParticipantsByApp(newChat)
            
            await this.SendWebhook('group-participants','group-participants.update', {
                data: newChat,
            }, this.key)
        })
    }

    async deleteInstance(key) {
      
            const filePath = path.join('sessions.json');

           
           let data = await fs.readFile(filePath, 'utf-8');
			
            let sessions = JSON.parse(data);

            
            let existingSession = sessions.find(session => session.key === key);
		

            if (existingSession)
			{
				let updatedSessions = sessions.filter(session => session.key !== key);
				
				//console.log(updatedSessions)
try{
    
       let salvar = await fs.writeFile(filePath, JSON.stringify(updatedSessions, null, 2), 'utf-8');
	
		
}
				catch(error)
					{
						console.log('erro ao salvar')
					}
				
			if(this.instance.online==true)
				{
			this.instance.deleted = true
			await this.instance.sock?.logout()
				}
			else{
			await this.deleteFolder('db/'+this.key)
			
				}
				
			
		}
			
			else
				{
					return {
                error: true,
                message: 'Session not found',
            }
					
				}
        }
    

    async getInstanceDetail(key) {
	let connect =	this.instance?.online;
	
	if(connect!==true)
	{
	connect = false;
	}
	const sessionData = await this.instanceFind(key)
        return {
            instance_key: key,
            phone_connected: connect,
			browser: sessionData.browser,
			webhook:sessionData.webhook,
			base64:sessionData.base64,
            webhookUrl: sessionData.webhookUrl,
			webhookEvents: sessionData.webhookEvents,
			messagesRead: sessionData.messagesRead,
			ignoreGroups: sessionData.ignoreGroups,	
            user: this.instance?.online ? this.instance.sock?.user : {},
        }
    }

    getWhatsAppId(id) {
        if (id.includes('@g.us') || id.includes('@s.whatsapp.net')) return id
        return id.includes('-') ? `${id}@g.us` : `${id}@s.whatsapp.net`
    }
 getGroupId(id) {
        if (id.includes('@g.us') || id.includes('@g.us')) return id
        return id.includes('-') ? `${id}@g.us` : `${id}@g.us`
    }

async deleteFolder(folder) {
        
	const folderPath = 	path.join(folder);
			
const folderExists = await fs.access(folderPath).then(() => true).catch(() => false);

        if (folderExists) {
            
            const files = await fs.readdir(folderPath);

            
            for (const file of files) {
                const filePath = path.join(folderPath, file);
                await fs.unlink(filePath);
            }

            
            await fs.rmdir(folderPath);
	
	
    }
}
		
async lerMensagem(idMessage,to)
		{
			try
			{
				const msg = await this.getMessage(idMessage,to)
				if(msg)
					{
				 await this.instance.sock?.readMessages([msg.key])
					}
				
				
			}
			catch(e)
				{
					//console.log(e)
				}
			
		}

    async verifyId(id) {
        if (id.includes('@g.us')) return true
        const [result] = await this.instance.sock?.onWhatsApp(id)
        if (result?.exists) return true
        throw new Error('no account exists')
    }
		
		async verifyGroup(id) {
		try{
	const result =
		await this.instance.sock?.groupFetchAllParticipating()
		if(result.hasOwnProperty(id))
		{
		return true;
		}
		else
		{
		throw new Error('group not exist')
		}
        //const result = await this.instance.sock?.groupMetadata(this.getWhatsAppId(id))
        //if (result?.id) return true
		}
		catch(error)
		{
        throw new Error('group not exist')
		}
    }
		
		
		
		

    async sendTextMessage(data) {
		
		let to = data.id
		
		if(data.typeId==='user')
		{
		
        await this.verifyId(this.getWhatsAppId(to))
		to = this.getWhatsAppId(to)
		}
		else
		{
		to = this.getGroupId(to)
	
		await this.verifyGroup(this.getGroupId(to))
		
		}
		if(data.options && data.options.delay && data.options.delay>0)
		{
		
		await this.setStatus('composing', to, data.options.delay)
		
		}


		
let mentions = false
		
	if (data.typeId === 'group' && data.groupOptions && data.groupOptions.markUser) {
    if (data.groupOptions.markUser === 'ghostMention') {
	
				
				
				const metadata = await this.instance.sock?.groupMetadata(this.getGroupId(to))
				
				 mentions = metadata.participants.map((participant) => participant.id)
				
				
				
			}
		else
			{
				
				mentions = this.parseParticipants(groupOptions.markUser)
				
			}
    
	}

			let quoted = {quoted:null}	
				
				if(data.options && data.options.replyFrom)
		{
			
			
			 			
		const msg =  await this.getMessage(data.options.replyFrom,to)
		
		
		if(msg)
		{
		
		quoted = {quoted:msg}
		}
		
	       
		}
		
	

const send = await this.instance.sock?.sendMessage(
    to,
  	{ 
text: data.message, mentions }, quoted)
	return send	
        
    }
	
 async getMessage(idMessage,to)
{
	try{
		//await  dados?.bind(sock?.ev)	
	
	const user_instance = this.instance.sock?.user.id;
	const user = this.getWhatsAppId(user_instance.split(':')[0]);
	
	const msg = await dados.loadMessage(to, idMessage)
		
		
		
	return msg
	}
	catch (error) 
	{
	
	return false
	
	}
	
	
	
}

    async sendMediaFile(data,origem) {
	let to = data.id
		
		if(data.typeId==='user')
		{
		
        await this.verifyId(this.getWhatsAppId(to))
		to = this.getWhatsAppId(to)
		}
		else
		{
		to = this.getGroupId(to)
	
		await this.verifyGroup(this.getGroupId(to))
		
		}
	let caption = ''
		if(data.options && data.options.caption)
		{
		
		caption = data.options.caption
		
		}


		
let mentions = false
		
	if (data.typeId === 'group' && data.groupOptions && data.groupOptions.markUser) {
    if (data.groupOptions.markUser === 'ghostMention') {
	
				
				
				const metadata = await this.instance.sock?.groupMetadata(this.getGroupId(to))
				
				 mentions = metadata.participants.map((participant) => participant.id)
				
				
				
			}
		else
			{
				
				mentions = this.parseParticipants(groupOptions.markUser)
				
			}
    
	}

			let quoted = {quoted:null}	
				
				if(data.options && data.options.replyFrom)
		{
			
			
			 			
		const msg =  await this.getMessage(data.options.replyFrom,to)
	
		
		if(msg)
		{
		quoted = {quoted:msg}
		}
		
	       
		}
		
	const acepty = ['audio','document','video','image']	
	
	if(!acepty.includes(data.type))
		{
			 throw new Error('Arquivo invalido')
		}
		
const origin = ['url','base64','file']
if(!origin.includes(origem))
		{
			 throw new Error('Metodo de envio invalido')
		}
let type = false
let mimetype = false
let filename = false
let file = false
let audio =false;
let document = false;
let video = false;
let image = false;


let myArray;
	if(data.type==='image')
		{
			myArray = config.imageMimeTypes
		}
	else if(data.type==='video')
		
		{
			myArray = config.videoMimeTypes
		}
	else if(data.type==='audio')
		
		{
			myArray = config.audioMimeTypes
			
		}
	else
		{
			myArray = config.documentMimeTypes
		}


if(origem ==='url')
	{
		const parsedUrl = url.parse(data.url)
if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') 
{
  
    mimetype =  await this.GetFileMime(data.url)

	
	if (!myArray.includes(mimetype.trim())) {
		
	
	throw new Error('Arquivo '+mimetype+' não é permitido para '+data.type)
	}
	
	
	origem = data.url;	
	  
}
}
	
else if(origem==='base64')
	{
		  mimetype = await getMimeTypeFromBase64(base64String);
		
		
	if (!myArray.includes(mimetype.trim())) {
		
	
	throw new Error('Arquivo '+mimetype+' não é permitido para '+data.type)
	}
		
		
		origem = data.base64
	}
	
	
		if(data.type==='audio')
			{
				if(mimetype==='audio/ogg')
					{
						
						if(data.options && data.options.delay)
		{	
			if(data.options.delay>0)
				{
				await this.instance.sock?.sendPresenceUpdate('recording',to)
				await delay(data.options.delay*1000)
				}
		}
				
			type = {
                    url: data.url,
			
               }
				mimetype = 'audio/mp4'
				filename = await this.getFileNameFromUrl(data.url)	
						
					}
				else
					{
						
					
		audio = await this.convertToMP4(origem);
		mimetype ='audio/mp4'
				type = await fs.readFile(audio);
			if(data.options && data.options.delay)
		{	
			if(data.options.delay>0)
				{
				await this.instance.sock?.sendPresenceUpdate('recording',to)
				await delay(data.options.delay*1000)
				}
		}
				}
			}
		
		else if (data.type==='video')
			{
				
				if(mimetype==='video/mp4')
				{
				type = {
                    url: data.url,
			
               }
				
				filename = await this.getFileNameFromUrl(data.url)
				
				}
				else
				{
				video = await this.convertTovideoMP4(origem);
		mimetype ='video/mp4'
				type = await fs.readFile(video);
				}
							
				
			}
		else
			{
		
		type = {
                    url: data.url,
			
               }
				
				filename = await this.getFileNameFromUrl(data.url)
			}
		
	

    
        const send = await this.instance.sock?.sendMessage(
            to,
            {
                mimetype: mimetype,
                [data.type]: type,
                caption: caption,
                ptt: data.type === 'audio' ? true : false,
                fileName: filename ? filename : file.originalname,
				mentions	
            },  quoted
        )
		
		if(data.type === 'audio' || data.type === 'video')
			{
		
				
				const tempDirectory = 'temp/';
		const files = await fs.readdir(tempDirectory);

 
    await Promise.all(files.map(async (file) => {
      const filePath = path.join(tempDirectory, file);
      await fs.unlink(filePath);
     
    }));
	}
				
			
        return send
    }
	
	async GetFileMime(arquivo)
{
	try{
	const file = await await axios.head(arquivo);
		return file.headers['content-type']
	return file
	}
	catch(error)
		{
			throw new Error(
                    'Arquivo invalido'
                )
		}
	
}

    async sendMedia(to, userType, file, type,  caption = '', replyFrom=false, d=false) {
       
	
		if(userType==='user')
		{
		
        await this.verifyId(this.getWhatsAppId(to))
		to = this.getWhatsAppId(to)
		}
		else
		{
		to = this.getGroupId(to)
	
		await this.verifyGroup(this.getGroupId(to))
		
		}

const acepty = ['audio','document','video','image']


let myArray;
	if(type==='image')
		{
			myArray = config.imageMimeTypes
		}
	else if(type==='video')
		
		{
			myArray = config.videoMimeTypes
		}
	else if(type==='audio')
		
		{
			myArray = config.audioMimeTypes
			
		}
	else
		{
			myArray = config.documentMimeTypes
		}
		
		const mime =  file.mimetype

	
	if (!myArray.includes(mime.trim())) {
		
	
	throw new Error('Arquivo '+mime+' não é permitido para '+type)
	}

	
	if(!acepty.includes(type))
		{
			 throw new Error('Type not valid')
		}
		let mimetype = false
		let filename = false
		let buferFile = false
if(type==='audio')
	{
		
		if(d>0)
		
		{
		
		await this.instance.sock?.sendPresenceUpdate('recording',to)
		await delay(d*1000)
		}
				
		if(mime==='audio/ogg')
		{
		
		const filePath = file.originalname;
const extension = path.extname(filePath);

 mimetype = 'audio/mp4';
	filename = file.originalname
		buferFile = file.buffer
		
		}
		else
		{
	
		filename = uuidv4()+'.mp4'
		
	
		
		
		
		const audio = await this.convertToMP4(file.buffer);
		//console.log(audio)
		mimetype ='audio/mp4'
				//type = await fs.readFile(audio);

			//await delay(1*1000)
		 buferFile = await fs.readFile(audio);
		
		
		}
	//mimetype ='audio/mp4'
		
		
		
	
	}
		else if (type==='video')
		{
		
		if(mime==='video/mp4')
		{
		
		const filePath = file.originalname;
const extension = path.extname(filePath);

 mimetype = 'video/mp4';
	filename = file.originalname
		buferFile = file.buffer
		
		}
		
		else
		{
		
		filename = uuidv4()+'.mp4'
		
	
		
		
		
		const video = await this.convertTovideoMP4(file.buffer);
		//console.log(audio)
		mimetype ='video/mp4'
				//type = await fs.readFile(audio);

			//await delay(1*1000)
		 buferFile = await fs.readFile(video);
		
		}
		
		
		}
else
	{
		
		
		const filePath = file.originalname;
const extension = path.extname(filePath);

const mimetype = getMIMEType.lookup(extension);
	filename = file.originalname
		buferFile = file.buffer
				
	}
	let quoted = {quoted:null}	
		if(replyFrom)
		{
			
			
			 			
		const msg =  await this.getMessage(replyFrom,to)

		
		if(msg)
		{
		quoted = {quoted:msg}
		}
		
	       
		}
		


        const data = await this.instance.sock?.sendMessage(
            to,
            {
                [type]: buferFile,
                caption: caption,
                mimetype: mimetype,
				ptt: type === 'audio' ? true : false,
                fileName: filename	
            }, quoted
        )
        

if(type==='audio' || type==='video')
	{
		
	
		const tempDirectory = 'temp/';
		const files = await fs.readdir(tempDirectory);

 
    await Promise.all(files.map(async (file) => {
      const filePath = path.join(tempDirectory, file);
      await fs.unlink(filePath);
     
    }));
	}

return data
    }
	
async newbuffer(mp4)
{
		
  
	try
	{
		
	const filePath = path.join('temp', mp4);
		
    const buffer = await fs.readFile(filePath);
	return buffer
		
	}
	catch(error)
	{
		throw new Error(
                    'Falha ao ler o arquivo mp4'
                )
		
	}
}
	
async criaFile(tipo,origem)
{
	
	try
	{
		if(tipo=='file')
			{
	
	const randomName = uuidv4();
	const fileExtension = path.extname(origem.originalname);
	const newFileName = `${randomName}${fileExtension}`;			
				
		
	
	await fs.writeFile('temp/'+newFileName, origem.buffer);
				return 'temp/'+newFileName
				
			}
		
	}
	catch(error)
	{
		throw new Error(
                    'Falha ao converter o arquivo MP4'
                )
		
	}
}

async convertemp4(file,retorno)
{
	
	
	try
	{
		const tempAudioPath = file;
		 
		 const output = 'temp/'+retorno
		
		const ffmpegCommand = `${ffmpegPath.path} -i "${tempAudioPath}" -vn -ab 128k -ar 44100 -f ipod "${output}" -y`;

exec(ffmpegCommand, (error, stdout, stderr) => {
  if (error) {
        reject({
          error: true,
          message: 'Failed to convert audio.',
        });
      }
	  else
		  {
			
			  return retorno
			  
		  }
	})
		
		
		
	}
	catch(error)
	{
		throw new Error(
                    'Falha ao converter o arquivo MP4'
                )
		
	}
	
}

    async DownloadProfile(of) {
        await this.verifyId(this.getWhatsAppId(of))
        const ppUrl = await this.instance.sock?.profilePictureUrl(
            this.getWhatsAppId(of),
            'image'
        )
        return ppUrl
    }

    async getUserStatus(of) {
        await this.verifyId(this.getWhatsAppId(of))
        const status = await this.instance.sock?.fetchStatus(
            this.getWhatsAppId(of)
        )
        return status
    }
		
	async contacts() {
      const folderPath = 'db/'+this.key; 
	
const filePath = path.join(folderPath, 'contacts.json');
	
try{
      await fs.access(folderPath);

  
    const currentContent = await fs.readFile(filePath, 'utf-8');
    const existingContacts = JSON.parse(currentContent);
		return {
                error: false,
                contacts: existingContacts,
            }
    }
catch (error) 
		{
		return {
                error: true,
                message: 'The contacts have not yet been loaded. ',
            }
		
		}
	}
		
	async chats() {
        const status ='retorno de chats'
        
        return status
    }


    async blockUnblock(to, data) {
		try{
		if(!data==='block')
			{
				data = 'unblock'
			}
			
        await this.verifyId(this.getWhatsAppId(to))
        const status = await this.instance.sock?.updateBlockStatus(
            this.getWhatsAppId(to),
            data
        )
        return status
		}
		catch(e)
		{
		return {
                error: true,
                message: 'Failed to lock/unlock',
            }
		}
    }

    async sendButtonMessage(to, data) {
        await this.verifyId(this.getWhatsAppId(to))
        const result = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                templateButtons: processButton(data.buttons),
                text: data.text ?? '',
                footer: data.footerText ?? '',
                viewOnce: true
            }
        )
        return result
    }

    async sendContactMessage(to, data) {
        await this.verifyId(this.getWhatsAppId(to))
        const vcard = generateVC(data)
        const result = await this.instance.sock?.sendMessage(
            await this.getWhatsAppId(to),
            {
                contacts: {
                    displayName: data.fullName,
                    contacts: [{ displayName: data.fullName, vcard }],
                },
            }
        )
        return result
    }

    async sendListMessage(to, data) {
        await this.verifyId(this.getWhatsAppId(to))
        const result = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                text: data.text,
                sections: data.sections,
                buttonText: data.buttonText,
                footer: data.description,
                title: data.title,
                viewOnce: true
            }
        )
        return result
    }

    async sendMediaButtonMessage(to, data) {
        await this.verifyId(this.getWhatsAppId(to))

        const result = await this.instance.sock?.sendMessage(
            this.getWhatsAppId(to),
            {
                [data.mediaType]: {
                    url: data.image,
                },
                footer: data.footerText ?? '',
                caption: data.text,
                templateButtons: processButton(data.buttons),
                mimetype: data.mimeType,
                viewOnce: true
            }
        )
        return result
    }
	

	async createJid(number) {
   
    if (!isNaN(number)) {
        
        const jid = `${number}@s.whatsapp.net`;
        return jid;
    } else {
        
        return number;
    }
}
	 

    async setStatus(status, to, pause=false) {
	
		
		 const number = await this.createJid(to)
		
        await this.verifyId(this.getWhatsAppId(to))
		 const result = await this.instance.sock?.sendPresenceUpdate(status, number)
		 if(pause>0)
		{
		await delay(pause*1000)
		await this.instance.sock?.sendPresenceUpdate('paused',number)
		}
		
		return result
    }

    // change your display picture or a group's
    async updateProfilePicture(id, url, type) {
		//console.log(id)
		 
        try {
		 let to
		 if(type==='user')
		 {
		 
		 await this.verifyId(this.getWhatsAppId(to))
			to = this.getWhatsAppId(id)
		}
		else
		{
		to = this.getGroupId(id)
	
		await this.verifyGroup(to)
		
		}
		 
            const img = await axios.get(url, { responseType: 'arraybuffer' })
            const res = await this.instance.sock?.updateProfilePicture(to, img.data )
            return {
                error: false,
                message: 'Photo changed successfully!',
            }
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message: 'Unable to update profile picture',
            }
        }
    }
	
	async mystatus(status)
{
	try
	{
		 const result = await this.instance.sock?.sendPresenceUpdate(status)
		 return {
                error: false,
                message:
                    'Status alterado para '+status,
            }
		
	}
	catch (e) 
	{
		return {
                error: true,
                message:
                    'Não foi possível alterar para o status '+status,
            }
		
	}
	
}

    // get user or group object from db by id
    async getUserOrGroupById(id) {
        try {
            let Chats = await this.getChat()
            const group = Chats.find((c) => c.id === this.getWhatsAppId(id))
            if (!group)
                throw new Error(
                    'unable to get group, check if the group exists'
                )
            return group
        } catch (e) {
            logger.error(e)
            logger.error('Error get group failed')
        }
    }

    // Group Methods
    parseParticipants(users) {
        return users.map((users) => this.getWhatsAppId(users))
    }

    async updateDbGroupsParticipants() {
        try {
            let groups = await this.groupFetchAllParticipating()
            let Chats = await this.getChat()
            if (groups && Chats) {
                for (const [key, value] of Object.entries(groups)) {
                    let group = Chats.find((c) => c.id === value.id)
                    if (group) {
                        let participants = []
                        for (const [
                            key_participant,
                            participant,
                        ] of Object.entries(value.participants)) {
                            participants.push(participant)
                        }
                        group.participant = participants
                        if (value.creation) {
                            group.creation = value.creation
                        }
                        if (value.subjectOwner) {
                            group.subjectOwner = value.subjectOwner
                        }
                        Chats.filter((c) => c.id === value.id)[0] = group
                    }
                }
                await this.updateDb(Chats)
            }
        } catch (e) {
            logger.error(e)
            logger.error('Error updating groups failed')
        }
    }

    async createNewGroup(name, users) {
	
        try {
            const group = await this.instance.sock?.groupCreate(
                name,
                users.map(this.getWhatsAppId)
            )
            return group
        } catch (e) {
            return {
                error: true,
                message:
                    'Erro ao criar o grupo',
            }
        }
    }

async groupFetchAllParticipating()
{
	try{
		const result =
                await this.instance.sock?.groupFetchAllParticipating()
		return result
		
	}
	catch(e)
		{
		return {
                error: true,
                message:
                    'Grupo não encontrado.',
            }
		
			
		}
}

    async addNewParticipant(id, users) {
		
        try {
			const result =
                await this.instance.sock?.groupFetchAllParticipating()
		if(result.hasOwnProperty(this.getGroupId(id)))
		{
			
            const res = await this.instance.sock?.groupParticipantsUpdate(
              this.getGroupId(id),
                 users.map(this.getWhatsAppId),
				  "add"
				  
            )
            return res
		}
			else
			{
			return {
                error: true,
                message:
                    'Grupo não encontrado.',
            }
			
			}
        } catch {
            return {
                error: true,
                message:
                    'Unable to add participant, you must be an admin in this group',
            }
        }
    }

    async makeAdmin(id, users) {
		
        try {
			const result =
                await this.instance.sock?.groupFetchAllParticipating()
		if(result.hasOwnProperty(this.getGroupId(id)))
		{
			
            const res = await this.instance.sock?.groupParticipantsUpdate(
               this.getGroupId(id),
                 users.map(this.getWhatsAppId),
				  "promote"
				  
            )
            return res
		}
			else
			{
			return {
                error: true,
                message:
                    'Grupo não encontrado.',
            }
			
			}
        } catch {
            return {
                error: true,
                message:
                    'Unable to add participant, you must be an admin in this group',
            }
        }
    }
			
 async removeuser(id, users) {
		
        try {
			const result =
                await this.instance.sock?.groupFetchAllParticipating()
		if(result.hasOwnProperty(this.getGroupId(id)))
		{
			
            const res = await this.instance.sock?.groupParticipantsUpdate(
                this.getGroupId(id),
                 users.map(this.getWhatsAppId),
				  "remove"
				  
            )
            return res
		}
			else
			{
			return {
                error: true,
                message:
                    'Grupo não encontrado.',
            }
			
			}
        } catch {
            return {
                error: true,
                message:
                    'Unable to add participant, you must be an admin in this group',
            }
        }
    }

    async demoteAdmin(id, users) {
		
        try {
			const result =
                await this.instance.sock?.groupFetchAllParticipating()
		if(result.hasOwnProperty(this.getGroupId(id)))
		{
			
            const res = await this.instance.sock?.groupParticipantsUpdate(
                this.getGroupId(id),
                 users.map(this.getWhatsAppId),
				  "demote"
				  
            )
            return res
		}
			else
			{
			return {
                error: true,
                message:
                    'Grupo não encontrado.',
            }
			
			}
        } catch {
            return {
                error: true,
                message:
                    'Unable to add participant, you must be an admin in this group',
            }
        }
    }

    

idLogado()
{
		const user_instance = this.instance.sock?.user.id;
		const user = this.getWhatsAppId(user_instance.split(':')[0]);
		return user;
}

    async leaveGroup(id) {


        try {
           const result =
                await this.instance.sock?.groupFetchAllParticipating()
		if(result.hasOwnProperty(this.getGroupId(id)))
		{
			 await this.instance.sock?.groupLeave(this.getGroupId(id))
            
			 return {
                error: false,
                message:
                    'Saiu do grupo.',
            		}
		}
else
	{
		return {
                error: true,
                message:
                    'Erro ao sair do grupo, verifique se o grupo ainda existe ou se você ainda participa do grupo!',
            }
		
	}
				
        } catch (e) {
            return {
                error: true,
                message:
                    'Erro ao sair do grupo, verifique se o grupo ainda existe.',
            }
        }
}


    async getInviteCodeGroup(id) {
		const to = this.getGroupId(id)
        try {
            await this.verifyGroup(to)
            const convite =  await this.instance.sock?.groupInviteCode(to)
			const url ='https://chat.whatsapp.com/'+convite
			return url;
			
        } catch (e) {
            console.log(e)
            return {
                error: true,
                message:
                    'Erro ao verificar o grupo, verifique se o grupo ainda existe ou se você é administrador.',
            }
        }
    }

    async getInstanceInviteCodeGroup(id) {
        try {
            return await this.instance.sock?.groupInviteCode(id)
        } catch (e) {
            logger.error(e)
            logger.error('Error get invite group failed')
        }
    }

    // get Chat object from db
    async getChat(key = this.key) {
        //let dbResult = await Chat.findOne({ key: key }).exec()
        let ChatObj = Chats
        return ChatObj
    }

    // create new group by application
    async createGroupByApp(newChat) {
        try {
            let Chats = await this.getChat()
            let group = {
                id: newChat[0].id,
                name: newChat[0].subject,
                participant: newChat[0].participants,
                messages: [],
                creation: newChat[0].creation,
                subjectOwner: newChat[0].subjectOwner,
            }
            Chats.push(group)
            await this.updateDb(Chats)
        } catch (e) {
            logger.error(e)
            logger.error('Error updating document failed')
        }
    }

    async updateGroupSubjectByApp(newChat) {
        //console.log(newChat)
        try {
            if (newChat[0] && newChat[0].subject) {
                let Chats = await this.getChat()
                Chats.find((c) => c.id === newChat[0].id).name =
                    newChat[0].subject
                await this.updateDb(Chats)
            }
        } catch (e) {
            logger.error(e)
            logger.error('Error updating document failed')
        }
    }

    async updateGroupParticipantsByApp(newChat) {
        //console.log(newChat)
        try {
            if (newChat && newChat.id) {
                let Chats = await this.getChat()
                let chat = Chats.find((c) => c.id === newChat.id)
                let is_owner = false
                if (chat) {
                    if (chat.participant == undefined) {
                        chat.participant = []
                    }
                    if (chat.participant && newChat.action == 'add') {
                        for (const participant of newChat.participants) {
                            chat.participant.push({
                                id: participant,
                                admin: null,
                            })
                        }
                    }
                    if (chat.participant && newChat.action == 'remove') {
                        for (const participant of newChat.participants) {
                            // remove group if they are owner
                            if (chat.subjectOwner == participant) {
                                is_owner = true
                            }
                            chat.participant = chat.participant.filter(
                                (p) => p.id != participant
                            )
                        }
                    }
                    if (chat.participant && newChat.action == 'demote') {
                        for (const participant of newChat.participants) {
                            if (
                                chat.participant.filter(
                                    (p) => p.id == participant
                                )[0]
                            ) {
                                chat.participant.filter(
                                    (p) => p.id == participant
                                )[0].admin = null
                            }
                        }
                    }
                    if (chat.participant && newChat.action == 'promote') {
                        for (const participant of newChat.participants) {
                            if (
                                chat.participant.filter(
                                    (p) => p.id == participant
                                )[0]
                            ) {
                                chat.participant.filter(
                                    (p) => p.id == participant
                                )[0].admin = 'superadmin'
                            }
                        }
                    }
                    if (is_owner) {
                        Chats = Chats.filter((c) => c.id !== newChat.id)
                    } else {
                        Chats.filter((c) => c.id === newChat.id)[0] = chat
                    }
                    await this.updateDb(Chats)
                }
            }
        } catch (e) {
            logger.error(e)
            logger.error('Error updating document failed')
        }
    }

   
			




    // update promote demote remove
    async groupParticipantsUpdate(id, users, action) {
        try {
            const res = await this.instance.sock?.groupParticipantsUpdate(
                this.getWhatsAppId(id),
                this.parseParticipants(users),
                action
            )
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'unable to ' +
                    action +
                    ' some participants, check if you are admin in group or participants exists',
            }
        }
    }

    // update group settings like
    // only allow admins to send messages
    async groupSettingUpdate(id, action) {
        try {
			await this.verifyGroup(id)
            const res = await this.instance.sock?.groupSettingUpdate(
                this.getWhatsAppId(id),
                action
            )
            return {
                error: false,
                message:
                    'Alteração referente a ' + action + ' Concluida',
            }
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'Erro ao alterar' + action + ' Verifique se você tem permissão ou se o grupo existe',
            }
        }
    }

    async groupUpdateSubject(id, subject) {
		
        try {
			await this.verifyGroup(id)
            const res = await this.instance.sock?.groupUpdateSubject(
                this.getWhatsAppId(id),
                subject
            )
			return {
                error: false,
                message:
                    'Nome do grupo alterado para '+subject
            }
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'Erro ao alterar o grupo, verifique se você é administrador ou se o grupo existe',
            }
        }
    }

    async groupUpdateDescription(id, description) {
		
        try {
			await this.verifyGroup(id)
            const res = await this.instance.sock?.groupUpdateDescription(
                this.getWhatsAppId(id),
                description
            )
			//console.log(res)
            return {
                error: false,
                message:
                    'Descrição do grupo alterada para '+description
            }
        } catch (e) {
            
            return {
                error: true,
                message:
                    'Falha ao alterar a descrição do grupo, verifique se você é um administrador ou se o grupo existe',
            }
        }
    }

async groupGetInviteInfo(url) {
        try {
			const codeurl = url.split('/');


			const code = codeurl[codeurl.length - 1];
			
			
            const res = await this.instance.sock?.groupGetInviteInfo(code)
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'Falha ao obter o verificar o grupo. Verifique o codigo da url ou se o grupo ainda existe..',
            }
        }
    }


async groupidinfo(id) {
      
		const to = this.getGroupId(id)
        try {
            await this.verifyGroup(to)
			
			
            const res = await this.instance.sock?.groupMetadata(to)
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'Grupo não existe',
            }
        }
    }

async groupAcceptInvite(id) {
        try {
            const res = await this.instance.sock?.groupAcceptInvite(id)
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'Falha ao obter o verificar o grupo. Verifique o codigo da url ou se o grupo ainda existe..',
            }
        }
    }

    // update db document -> chat
    async updateDb(object) {
        try {
            await Chat.updateOne({ key: this.key }, { chat: object })
        } catch (e) {
            logger.error('Error updating document failed')

        }
    }

    async readMessage(msgObj) {
        try {
            const key = {
                remoteJid: msgObj.remoteJid,
                id: msgObj.id,
                participant: msgObj?.participant // required when reading a msg from group
            }
            const res = await this.instance.sock?.readMessages([key])
            return res
        } catch (e) {
            logger.error('Error read message failed')
        }
    }

    async reactMessage(id, key, emoji) {
        try {
            const reactionMessage = {
                react: {
                    text: emoji, // use an empty string to remove the reaction
                    key: key
                }
            }
            const res = await this.instance.sock?.sendMessage(
                this.getWhatsAppId(id),
                reactionMessage
            )
            return res
        } catch (e) {
            logger.error('Error react message failed')
        }
    }
}

exports.WhatsAppInstance = WhatsAppInstance
