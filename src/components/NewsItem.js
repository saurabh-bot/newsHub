import React, { Component } from 'react'

export default class NewsItem extends Component {
    
    render() {
        let {title, description, imageUrl, newsUrl} = this.props;
        let defaultImage = "https://pt.unbilgi.com/wp-content/uploads/2020/12/Katherine-Langford-770x433.jpg";
        return (
            <div className="my-3">
                <div className="card" style={{width: '18rem'}}>
                    <img src={imageUrl || defaultImage} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{description}</p>
                        <a href={newsUrl} rel="noreferrer" target="_blank" className="btn btn-sm btn-dark">Read More</a>
                    </div>
                </div>
            </div>
        )
    }
}
