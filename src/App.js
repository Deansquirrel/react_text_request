import React, {Component} from 'react';
import { LocaleProvider } from 'antd';
import { Row,Col,Input,Divider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import "antd/dist/antd.css";
import "./App.css"
import $ from 'jquery'
import {GetPort,UpdatePort} from  './myConfig.js'

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
            searchPhone:"",
            searchResult:"",
            result:{},
            showResult:false,
            canDo:true,
            port:0,
        }
    }

    getName(){
        console.log(GetPort())
        UpdatePort(1234)
        console.log(GetPort())
        $.ajax({
            url:'../../config.json',
            cache:false,
            dataType:'json',
            success:function(data){
                console.log(data)
                this.setState({
                    port:data["port"]
                });
            }.bind(this),
            error:function(e){
                console.log(e.toString())
                this.setState({
                    port:0
                });
            }.bind(this)
        });
    }

    onSearch(value){
        this.setState({
            searchPhone:value
        });
        this.getJsonResult(value)
    }

    getJsonResult(searchPhone){
        let d = {};
        d.phone = searchPhone;
        console.log(JSON.stringify(d));
        $.ajax({
            type:'POST',
            url:'http://192.168.8.104:8000/text',
            data:JSON.stringify(d),
            dataType:'json',
            timeout:30000,
            contentType:'application/json',
            cache:false,
            sync:true,
            beforeSend:function(){
                this.setState({
                    canDo:false
                });
            }.bind(this),
            complete:function(){
                this.setState({
                    canDo:true
                });
            }.bind(this),
            success: function (data) {
                this.setState({
                    searchResult:data['errcode'] === 0?"success":"failed",
                    result:data,
                    showResult:true,
                })
            }.bind(this),
        })
    }

    render(){
        return (
            <div className={"SearchContainer"}>
                <div>{this.state.port}</div>
                <SearchForm
                    placeholder={"手机号"}
                    canDo={this.state.canDo}
                    searchPhone={this.state.searchPhone}
                    onSearch={(value)=>{this.onSearch(value);this.getName()}} />
                <ResultInfo
                    searchPhone={this.state.searchPhone}
                    searchResult={this.state.searchResult}
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
            console.log(value);
            this.props.onSearch(value)
        }
    }

    render(){
        return (
            <div>
                <Search
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
                        SearchPhone
                    </Col>
                    <Col className={"ResultInfo_content"} span={16}>
                        {this.props.searchPhone}
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className={"ResultInfo_title"} span={8}>
                        SearchResult
                    </Col>
                    <Col className={"ResultInfo_content"} span={16}>
                        {this.props.searchResult}
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