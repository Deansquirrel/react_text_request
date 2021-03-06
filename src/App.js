import React, {Component} from 'react';
import { LocaleProvider } from 'antd';
import { Row,Col,Input,Divider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import "antd/dist/antd.css";
import "./App.css"
import $ from 'jquery'
// import {GetPort,UpdatePort} from  './myConfig.js'

export default App;



function App(){
    return (
        <LocaleProvider locale={zhCN}>
            <div className={"rootContainer"}>
                <SearchContainer />
            </div>
        </LocaleProvider>
    )
}

class SearchContainer extends React.Component {

    constructor(props){
        super(props);
        this.state={
            updatePhone:"",
            updateResult:"",
            result:{},
            showResult:false,
            canDo:true,
            user:"",
            address:"",
        }
    }

    componentWillMount() {
        $.ajax({
            url:'../../config.json',
            cache:false,
            dataType:'json',
            success:function(data){
                // console.log(data)
                this.setState({
                    user:data["name"],
                    address:data["address"]
                });
            }.bind(this),
            error:function(e){
                // console.log(e.toString())
                this.setState({
                    user:"",
                    address:""
                });
            }.bind(this)
        });
    }

    onSearch(value){
        this.setState({
            updatePhone:value
        });
        this.getJsonResult(value)
    }

    getJsonResult(updatePhone){
        let d = {};
        d.phone = updatePhone;
        // console.log(JSON.stringify(d));
        const serverUrl= this.state.address + "/text";
        $.ajax({
            type:'POST',
            url:serverUrl,
            data:JSON.stringify(d),
            dataType:'json',
            timeout:30000,
            contentType:'application/json',
            cache:false,
            sync:true,
            beforeSend:function(){
                this.setState({
                    canDo:false,
                    showResult:false,
                });
            }.bind(this),
            complete:function(){
                this.setState({
                    canDo:true
                });
                const i = document.getElementById("inputSearch");
                i.focus();
            }.bind(this),
            success: function (data) {
                this.setState({
                    updateResult:data['errcode'] === 0?"success":"failed",
                    result:data,
                    showResult:true,
                })
            }.bind(this),
            error:function(xhr,status,e) {
                let errMsg = "[" + xhr.status + "]" + status + ":"+ e.toString();
                this.setState({
                    updateResult:"failed",
                    result:{"errcode":-1,"errmsg":errMsg},
                    showResult:true,
                })
            }.bind(this)
        })
    }

    render(){
        return (
            <div className={"SearchContainer"}>
                <p style={{marginLeft:'10px'}}>{this.state.user}</p>
                <SearchForm
                    placeholder={"手机号"}
                    canDo={this.state.canDo}
                    updatePhone={this.state.updatePhone}
                    onSearch={(value)=>{this.onSearch(value)}} />
                <ResultInfo
                    updatePhone={this.state.updatePhone}
                    updateResult={this.state.updateResult}
                    result={this.state.result}
                    showResult={this.state.showResult?"block":"none"} />
            </div>
        )
    }
}

const Search = Input.Search;

class SearchForm extends Component {
    onSearch(value){
        value = value.trim();
        if (value !== "") {
            // console.log(value);
            this.props.onSearch(value)
        }
    }

    render(){
        return (
            <div>
                <Search
                    id={"inputSearch"}
                    autoFocus
                    defaultValue={""}
                    disabled={!this.props.canDo}
                    allowClear
                    placeholder={this.props.placeholder}
                    enterButton="Update"
                    size="large"
                    onSearch={(value) => {this.onSearch(value)}}
                />
            </div>
        )
    }
}

class ResultInfo extends Component {
    render(){
        return (
            <div className={"ResultInfo"} style={{display:this.props.showResult}}>
                <Divider />
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className={"ResultInfo_title"} span={8}>
                        UpdatePhone
                    </Col>
                    <Col className={"ResultInfo_content"} span={16}>
                        {this.props.updatePhone}
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className={"ResultInfo_title"} span={8}>
                        UpdateResult
                    </Col>
                    <Col className={"ResultInfo_content"} span={16}>
                        {this.props.updateResult}
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{display:this.props.result.errCode===0?"none":"block"}}>
                    <Col className={"ResultInfo_title"} span={8}>
                        errCode
                    </Col>
                    <Col className={"ResultInfo_content"} span={16}>
                        {this.props.result.errcode}
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{display:this.props.result.errCode===0?"none":"block"}}>
                    <Col className={"ResultInfo_title"} span={8}>
                        errMsg
                    </Col>
                    <Col className={"ResultInfo_content"} span={16}>
                        {this.props.result.errmsg}
                    </Col>
                </Row>
            </div>
        )
    }
}